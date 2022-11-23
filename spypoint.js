import fetch from 'node-fetch'

const API_BASE = 'https://restapi.spypoint.com/api/v3'
const LOGIN = `${API_BASE}/user/login`
const CAMERAS = `${API_BASE}/camera/all`
const PHOTOS = `${API_BASE}/photo/all`
const FILTERS = `${API_BASE}/photo/filters`

const isRequired = () => { throw new Error('param is required'); };

class SpypointClient {

  constructor(authorization) {
    this._headers = {
      'Content-Type': 'application/json'
    }
    this._headers.authorization = authorization
  }

  async _get(apiEndpoint) {
    const data = await fetch(apiEndpoint, {
      headers: this._headers
    })
    return data.json()
  }

  async _post(cameraId = isRequired(), { limit: 100, tags: []} = {}) {

    const { limit, tags } = options

    const data = await fetch(PHOTOS, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        camera: [cameraId],
        dateEnd: "2100-01-01T00:00:00.000Z",
        favorite: false,
        hd: false,
        tag: tags,
        limit
      })
    })
    return data.json()
  }

  /**
   * Note: This is an async function, it retrieves a list of available tags from Spytpoint and
   * compares the provided tags to ensure they match. Spypoint occasionally changes these hence why
   * this is necessary otherwise it will return an error if you add a no longer supported tag. 
   */ 

  async _tagParamCheck(tags){

    if (typeof tags === 'string'){
      tags = [tags]
    }

    if (!Array.isArray(tags)){
      return console.error('Tag parameter needs to either be a string or an array of strings')
    }

    tags = tags.map(tag => tag.toLowerCase())

    const filters = await this.filters()
    const filteredNames = filters.species.map(({nameId}) => nameId)

    const cleanTags = tags.filter( tag => {
      if (!filteredNames.includes(tag)){
        console.error(`The tag "${tag}" is not an available option. 
          Please check your spelling or use Spypoint.filters() to 
          see all available tags.`)
        return false
      }
      return tag
    })

    return cleanTags
  }

  /**
   * @return {Object} - Auth token and uuid credentials
   */

  async login(username, password) {
    const credentialRes = await fetch(LOGIN, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        username,
        password
      })
    })

    if (credentialRes.status !== 200){
      throw new Error(`HTTP Error: Status ${credentialRes.status} | ${credentialRes.statusText}`)
    }

    const { token } = await credentialRes.json()

    return this._headers.authorization = `Bearer ${token}`

  }

  /**
   * @return {string[]} - List of unique identifiers for each camera on the account
   */

  async cameras() {
    const cameras =  await this._get(CAMERAS)
    return cameras
  }

  /**
   * @return {Object[]} - List of available filter tags w/ nameId and iconUrl
   */

  async filters() {
    const filters = await this._get(FILTERS)
    return filters
  }

    /**
 * @param  {string} cameraId - Unique identifier of the camera to request photos from
 * @param  {number} [limit=100] - Maximum number of photos to request. Minimum of
 * @param  {string[]} [tags=[]] - Filter tags to limit results by photo subject i.e. 'deer', 'bears'
 * @return {Object[]} An array of photo objects
 */

  async photosByCamera(cameraId = isRequired(), { limit =  100, tags =  []} = {}){

    tags = await this._tagParamCheck(tags)

    const photos = await this._post(cameraId, { limit, tags })
    return photos
  }

  /**
   * @param  {string[]|string} [tags=[]] - Query to limit results by photo subject i.e. 'deer', 'bears'
   * @return {Object[]} - The most recent photo from each camera
   */


  async mostRecentPhotosByCamera(tags = []) {
    
    const cameras = await this.cameras()
    const photoReq = cameras.map(({ id }) => this.photosByCamera(id, { limit: 1, tags }))
    const photoDataRes = await Promise.all(photoReq)

    return photoDataRes
      .filter(({ cameraIds }) => !!cameraIds.length)
      .map(photoList =>  photoList.photos[0])

  }

  /**
   * @param  {string[]|string} [tags=[]] - Query to limit results by photo subject i.e. 'deer', 'bears'
   * @param  {number} [limit=100] - Maximum number of photos to request per camera
   * @return {Object[]} - All photos filtered by the given tags and limit
   */

  /**
   * Note: The Spypoint API limits results to most recent 25 photos
   */

  async queryAllPhotos({ limit = 100, tags = []} = { limit, tags }) {

    tags = await this._tagParamCheck(tags)

    const cameras = await this.cameras()

    const photoReq = cameras.map(({ id }) => {
      return this.photosByCamera(id, {limit, tags})
    })
    const photoRes = await Promise.all(photoReq)

    const filteredPhotos = photoRes.filter(photo => !!photo.photos.length)

    return filteredPhotos
  }
}

export default SpypointClient