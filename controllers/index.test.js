import request from 'supertest'
import { SHIP_DIRECTION, SHIP_TYPE } from '../utils/constants'
import app from '../app'

const resetGame = () => (request(app).get('/api/reset'))
const placeShip = (body) => (request(app).post('/api/ship').send(body))
const getCurrentOcean = () => (request(app).get('/api'))
const attack = (body) => (request(app).post('/api/attack').send(body))

describe('controllers', () => {
  describe('get current ocean controller', () => {
    it('should return ocean data', async () => {
      const res = await getCurrentOcean()
      expect(res.statusCode).toEqual(200)
      expect(JSON.parse(res.text).ocean_data.length).toEqual(10)
    })
  })

  describe('place-ship controller', () => {
    it('should succeed place a ship', async () => {
      const reqBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      const response = await placeShip(reqBody)
      expect(response.text).toEqual('Placed')
    })

    it('should return bad request', async () => {
      const reqBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      await placeShip(reqBody)
      const response = await placeShip(reqBody)
      expect(response.status).toEqual(400)
      expect(response.text).toEqual('This location is occupied')
    })
  })

  describe('resetGame', () => {
    it('should clear ocean data and create new ocean', async () => {
      const reqBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      await placeShip(reqBody)
      await resetGame()
      const response = await getCurrentOcean()
      expect(JSON.parse(response.text).ocean_data[0][0]).toBeNull()
    })
  })

  describe('attack', () => {
    it('should return HIT', async () => {
      const placeShipBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      const attackBody = {
        coordinateX: 0,
        coordinateY: 0
      }

      await placeShip(placeShipBody)
      const response = await attack(attackBody)
      expect(response.text).toEqual('HIT')
    })

    it('should return HIT', async () => {
      const placeShipBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      await placeShip(placeShipBody)
      await attack({
        coordinateX: 0,
        coordinateY: 0
      })
      await attack({
        coordinateX: 1,
        coordinateY: 0
      })
      await attack({
        coordinateX: 2,
        coordinateY: 0
      })
      const response = await attack({
        coordinateX: 3,
        coordinateY: 0
      })
      expect(response.text).toEqual('SANK')
    })
  })
})
