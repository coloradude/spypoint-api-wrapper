# spypoint-api-wrapper
A simple Node.js wrapper for the Spypoint game camera API

## Getting Started

### Initialize the Spypoint client

```js
import SpypointClient from 'spypoint-api-wrapper'

const Spypoint = new SpypointClient('YOUR_EMAIL_OR_USERNAME', 'YOUR_PASSWORD')
await Spypoint.login()
```

## API

<a name="Spypoint.login()"></a>

### Spypoint.login() ⇒ <code>Promise.&lt;string&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;string&gt;</code> - Bearer token used for authorization (this is automatically set and added to all requests)

<a name="Spypoint.cameras()"></a>

### Spypoint.cameras() ⇒ <code>Promise.&lt;Array&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of all available `cameraId`s

<a name="Spypoint.filters"></a>

### Spypoint.filters() ⇒ <code>Promise.&lt;Array&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of all available filter tags

<a name="Spypoint.mostRecentPhotosByCamera"></a>

### Spypoint.mostRecentPhotosByCamera() ⇒ <code>Promise.&lt;Array&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of most recent photo taken from each camera

<a name="Spypoint.photosByCamera"></a>

### Spypoint.photosByCamera(cameraId, [options]) ⇒ <code>Promise.&lt;Array&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of photos from an individual camera 

| Param | Type | Description |
| --- | --- | --- |
| cameraId | <code>string</code> | Unique identifier for the camera to request photos from
| [options] | <code>Object</code> | Options object |
| [options.tags] | <code>Array</code> \| <code>string</code> | Array of filter tag options or a single tag as a string |
| [options.limit] | <code>Number</code> | Maximum number of results to return |

<a name="Spypoint.allPhotosByFilter"></a>

### Spypoint.allPhotosByFilter([options]) ⇒ <code>Promise.&lt;Array&gt;</code>
**Kind**: Spypoint method

**Returns**: <code>Promise.&lt;Array&gt;</code> - List of photo by individual camera 

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | Options object |
| [options.tags] | <code>Array</code> \| <code>string</code> | Array of filter tag options or a single tag as a string |
| [options.limit] | <code>Number</code> | Maximum number of results to return |