# spypoint-api-wrapper
A simple Node.js wrapper for the Spypoint game camera API

## Getting Started

### Initialize the Spypoint client

```js
import SpypointClient from 'spypoint-api-wrapper'

const Spypoint = new SpypointClient()
await Spypoint.login('YOUR_EMAIL_OR_USERNAME', 'YOUR_PASSWORD')
```

### Using within express.js routes and individual users

```js
import SpypointClient from './spypoint.js'

// Send user crederntials to login route and set auth token on the cookie

router.post('/login', async (req, res) => {

  const Spypoint = new SpypointClient()
  const bearer = await Spypoint.login(req.body.email, req.body.password)
  res.cookie('authorization', bearer, {
    expire: '2100-01-01T00:00:00.000Z,
    httpOnly: process.env.NODE_ENV === 'production' ? true : false
  })
  res.send()

})

// Middleware to pass auth token for requestsg

const SpypointInit = (req, res, next) => {
  if (!req.cookies.authorization) throw Error('You need to login with valid credentials first!')
  req.Spypoint = new SpypointClient(req.cookies.authorization)
  next()
}


router.get('/', SpypointInit, (req, res) => {
  const cameras = await req.Spypoint.cameras()
  res.send(cameras)
})

```
## API

<a name="Spypoint.login()"></a>

### Spypoint.login() ⇒ <code>Promise.&lt;string&gt;</code>

**Returns**: <code>Promise.&lt;string&gt;</code> - Bearer token used for authorization (this is automatically set and added to all requests)

<a name="Spypoint.cameras()"></a>

### Spypoint.cameras() ⇒ <code>Promise.&lt;Array&gt;</code>

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of all available `cameraId`s

<a name="Spypoint.filters"></a>

### Spypoint.filters() ⇒ <code>Promise.&lt;Object&gt;</code>

**Returns**: <code>Promise.&lt;Object&gt;</code> - Object containing a property `.species` w/ list of all available filter tags

<a name="Spypoint.mostRecentPhotosByCamera"></a>

### Spypoint.mostRecentPhotosByCamera() ⇒ <code>Promise.&lt;Array&gt;</code>

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of most recent photo taken from each camera

<a name="Spypoint.photosByCamera"></a>

### Spypoint.photosByCamera(cameraId, [options]) ⇒ <code>Promise.&lt;Array&gt;</code>

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of photos from an individual camera 

| Param | Type | Description |
| --- | --- | --- |
| cameraId | <code>string</code> | Unique identifier for the camera to request photos from
| [options] | <code>Object</code> | Options object |
| [options.tags] | <code>Array</code> \| <code>string</code> | Array of filter tag options or a single tag as a string |
| [options.limit] | <code>Number</code> | Maximum number of results to return |

<a name="Spypoint.queryAllPhotos"></a>

### Spypoint.queryAllPhotos([options]) ⇒ <code>Promise.&lt;Array&gt;</code>

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of photo by individual camera 

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | Options object |
| [options.tags] | <code>Array</code> \| <code>string</code> | Array of filter tag options or a single tag as a string |
| [options.limit] | <code>Number</code> | Maximum number of results to return |


