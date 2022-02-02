import fetch from 'node-fetch'

const API_BASE = 'https://restapi.spypoint.com/api/v3'
const LOGIN_ENDPOINT = `${API_BASE}/user/login`
const CAMERA_ENDPOINT = `${API_BASE}/camera/all`
const PHOTO_ENDPOINT = `${API_BASE}/photo/all`
const FILTERS_ENDPOINT = `${API_BASE}/photo/filters`

const isRequired = () => { throw new Error('param is required'); };

class SpypointClient {

  constructor(
    username = isRequired(), 
    password = isRequired()
  ){
    this._username = username
    this._password = password
    this._headers;
  }

  /**
   * @return {Object} - Auth token and uuid credentials
   */

  async login() {

    const credentialRes = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this._username, 
        password: this._password
      })
    })

    if (credentialRes.status !== 200){
      throw new Error(`HTTP Error: Status ${credentialRes.status} | ${credentialRes.statusText}`)
    }

    const { token } = await credentialRes.json()

    this._headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }

   return this._headers.authorization
  }

  /**
   * @return {string[]} - List of unique identifiers for each camera on the account
   */

  async cameras() {
    const cameras =  await fetch(
      CAMERA_ENDPOINT, 
      { headers: this._headers }
    )
    return cameras.json()
  }

  /**
   * @return {Object[]} - List of available filter tags w/ nameId and iconUrl
   */

  async filters() {
    const filters = await fetch(FILTERS_ENDPOINT, {
      headers: this._headers
    })
    return filters.json()
  }

    /**
 * @param  {string} cameraId - Unique identifier of the camera to request photos from
 * @param  {number} [limit=100] - Maximum number of photos to request. Minimum of
 * @param  {string[]} [tags=[]] - Filter tags to limit results by photo subject i.e. 'deer', 'bears'
 * @return {Object[]} An array of photo objects
 */

    async photosByCamera(cameraId = isRequired(), options = {limit: 100, tags: []}){

    const body = JSON.stringify({
      camera: [cameraId],
      dateEnd: "2100-01-01T00:00:00.000Z",
      favorite: false,
      hd: false,
      tag: options.tags,
      limit: options.limit,
    })

    const photos = await fetch(PHOTO_ENDPOINT, {
      method: 'POST',
      headers: this._headers,
      body
    })

    return photos.json()
  }

  /**
   * @return {Object[]} - The most recent photo from each camera
   */

  async mostRecentPhotosByCamera() {
    
    const cameras = await this.cameras()
    const photoReq = cameras.map(({ id }) => this.photosByCamera(id, 1))
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

  async allPhotosByFilter(options = { limit: 100, tags: []}) {

    if (typeof options.tags === 'string'){
      options.tags = [options.tags]
    }

    if (!Array.isArray(options.tags)){
      return console.error('Tag parameter needs to either be a string or an array of strings')
    }

    options.tags = options.tags.map(tag => tag.toLowerCase())

    const filters = await this.filters()
    const filteredNames = filters.species.map(({nameId}) => nameId)


    const cleanTags = options.tags.filter( tag => {
      if (!filteredNames.includes(tag)){
        console.error(`The tag "${tag}" is not an available option. Please check your spelling.`)
        return false
      }
      return tag
    })

    const cameras = await this.cameras()

    const photoReq = cameras.map(({ id }) => {
      return this.photosByCamera(id, {limit: options.limit, tags: cleanTags})
    })
    const photoRes = await Promise.all(photoReq)

    const filteredPhotos = photoRes.filter(photo => !!photo.photos.length)

    return filteredPhotos
  }
}

export default SpypointClient