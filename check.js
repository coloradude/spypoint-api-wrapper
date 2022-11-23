import SpypointClient from './spypoint.js'

const Spypoint = new SpypointClient()
const res = await Spypoint.login('robboflo@gmail.com', 'DahmLake2020!')

const cameras = await Spypoint.cameras()

const photo = await Spypoint.photosByCamera('62d769b0378d662dc78ed441')

// // const newPhotos = await Spypoint.mostRecentPhotosByCamera()
// // console.log(newPhotos)

const allPhotos = await Spypoint.queryAllPhotos({ limit: 5, tags: ['deer']})



console.log(allPhotos)




// 62d769b0378d662dc78ed441
// console.log(cameras)