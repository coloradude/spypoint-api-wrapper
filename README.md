# spypoint-api-wrapper
A Javascript wrapper for the Spypoint game camera API

## Getting Started

### Initialize the Spypoint client

```js
import SpypointClient from 'spypoint-api-wrapper'

const Spypoint = new SpypointClient('YOUR_EMAIL_OR_USERNAME', 'YOUR_PASSWORD')
await Spypoint.login()
```

## API

### Spypoint.login()

Must be called after client initialization and before any other methods to retrieve authentication information

### Spypoint.cameras()

Retrieves a list of all available cameras

### Spypoint.filters()

Retrieves a list of all available filters

### Spypoint.photosByCamera(cameraId, limit = 100, filters = [])

Retrieves all photos from spcecified camera

### Spypoint.mostRecentPhotosByCamera(cameraID)

Retrieves the most recent image from each camera

### Spypoint.allPhotosByfilter(cameraId, tags = [], limit = 100)

Retrieves filtered list of photos from each camera. Reference avaliable filters w/ `Spypoint.filters()`