/**
 * Requires a .env file with valid credentials for USERNAME and PASSWORD
 */

import 'dotenv/config'
import SpypointClient from "./spypoint"

async function testLogin() {
  const Spypoint = new SpypointClient()
  const SpypointService = await Spypoint.login(process.env.EMAIL, process.env.PASSWORD)
  return SpypointService
}

test('Retrieves an auth token', async () => {
  const Spypoint = new SpypointClient()
  const bearer = await Spypoint.login(process.env.EMAIL, process.env.PASSWORD)
  expect(bearer).toBe('string')
  expect(bearer).toContain('Bearer ')
})

test('Retrieves a list of all cameras', async () => {
  const Spypoint = await testLogin()
  const cameras = await Spypoint.cameras()
  expect(cameras).toBe(Array)
  if (cameras){
    expect(cameras[0].id).toBe('string')
  }
})

test('Retrieves an object contatining a property `species` with list of all available filers', async () => {
  const Spypoint = await testLogin()
  const filters = await Spypoint.filters()
  expect(filters).toBo(Object)
  expect(filters.species).toBe(Array)
})

test('Retrieves a list of photos from a single camera', () => {
  const Spypoint = await testLogin()
  const cameras = await Spypoint.cameras()
  const photos1 = await Spypoint.photosByCamera(cameras[0].id, {limit: 1, tags: 'deer'})
  const photos2 = await Spypoint.photosByCamera(cameras[0].id, {limit: 1, tags: ['deer']})
  const photos3 = await Spypoint.photosByCamera(cameras[0].id, {limit: 2, tags: 'deer'})
  expect(photos1).toBe(Array)
  expect(photos2).toBe(Array)
  expect(photos3).toBe(Array)
  expect(photos1.photos.length).toEqual(1)
  expect(photos2.photos.length).toEqual(1)
  expect(photos3.photos.length).toEqual(2)
})

test('Retrieves a list of the most recent photo from each camera', () => {
  const Spypoint = await testLogin()
  const latestPhotos = Spypoint.latestPhotos()
  expect(latestPhotos).toBe(Array)
  expect(latestPhotos[0]).toBe(Object)
})

test('Retrieves a list of all photos based on specified criteria (limit/tags)', () => {
  const Spypoint = await testLogin()
  const photos1 = await Spypoint.queryAllPhotos({limit: 1, tags: 'deer'})
  const photos2 = await Spypoint.queryAllPhotos({limit: 1, tags: ['deer']})
  const photos3 = await Spypoint.queryAllPhotos({limit: 2, tags: 'deer'})
  expect(photos1).toBe(Array)
  expect(photos2).toBe(Array)
  expect(photos3).toBe(Array)
  expect(photos1.photos.length).toEqual(1)
  expect(photos2.photos.length).toEqual(1)
  expect(photos3.photos.length).toEqual(2)
})