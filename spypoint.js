import fetch from 'node-fetch'

const API_BASE = 'https://restapi.spypoint.com/api/v3'
const LOGIN = `${API_BASE}/user/login`
const CAMERAS = `${API_BASE}/camera/all`
const PHOTOS = `${API_BASE}/photo/all`
const FILTERS = `${API_BASE}/photo/filters`

const isRequired = () => { throw new Error('param is required'); };

class SpypointClient {

  constructor(
    username = isRequired(), 
    password = isRequired()
  ){
    this._username = username
    this._password = password
    this._headers = {
      'Content-Type': 'application/json'
    }
  }

  async _get(apiEndpoint) {
    const data = await fetch(apiEndpoint, {
      headers: this._headers
    })
    return data.json()
  }

  async _post(cameraId = isRequired(), { tags = [], limit = 100 }) {

    const data = await fetch(PHOTOS, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        cameraId: [cameraId],
        dateEnd: "2100-01-01T00:00:00.000Z",
        favorite: false,
        hd: false,
        tag: tags,
        limit
      })
    })
    return data.json()
  }

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
        console.error(`The tag "${tag}" is not an available option. Please check your spelling or use Spypoint.filters() to see all available tags.`)
        return false
      }
      return tag
    })

    return cleanTags
  }

  /**
   * @return {Object} - Auth token and uuid credentials
   */

  async login() {

    const credentialRes = await fetch(LOGIN, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        username: this._username, 
        password: this._password
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

  async photosByCamera(cameraId = isRequired(), { limit = 100, tags = [] }){

    tags = await this._tagParamCheck(tags)

    const photos = await this._post(cameraId, {limit, tags})
    return photos
  }

  /**
   * @return {Object[]} - The most recent photo from each camera
   */

  async mostRecentPhotosByCamera() {
    
    const cameras = await this.cameras()
    const photoReq = cameras.map(({ id }) => this.photosByCamera(id, { limit: 1 }))
    const photoDataRes = await Promise.all(photoReq)
    return photoDataRes
      .filter(({ photos }) => !!photos.length)
      .map(({ photos }) => photos[0])

  }

  /**
   * @param  {string[]|string} [tags=[]] - Query to limit results by photo subject i.e. 'deer', 'bears'
   * @param  {number} [limit=100] - Maximum number of photos to request per camera
   * @return {Object[]} - All photos filtered by the given tags and limit
   */

  async queryAllPhotos({ limit = 100, tags = []}) {

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