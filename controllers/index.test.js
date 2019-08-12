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
        shipType: SHIP_TYPE.BATTLESHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      const response = await placeShip(reqBody)
      expect(response.text).toEqual('Placed')
    })

    it('should return bad request since ship amount exceeds', async () => {
      const reqBody = {
        shipType: SHIP_TYPE.BATTLESHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }

      await placeShip(reqBody)
      const response = await placeShip(reqBody)
      expect(response.text).toEqual('Number of ship exceeds')
    })

    it('should return bad request since it is occupied', async () => {
      const reqBody = {
        shipType: SHIP_TYPE.CRUISER,
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
        shipType: SHIP_TYPE.BATTLESHIP,
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
    const prepareBattleField = async () => {
      await placeShip({
        shipType: SHIP_TYPE.BATTLESHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      })
      await placeShip({
        shipType: SHIP_TYPE.CRUISER,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 5,
        coordinateY: 0
      })
      await placeShip({
        shipType: SHIP_TYPE.CRUISER,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 2
      })

      await placeShip({
        shipType: SHIP_TYPE.DESTROYER,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 5,
        coordinateY: 2
      })
      await placeShip({
        shipType: SHIP_TYPE.DESTROYER,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 4
      })
      await placeShip({
        shipType: SHIP_TYPE.DESTROYER,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 3,
        coordinateY: 4
      })
      await placeShip({
        shipType: SHIP_TYPE.SUBMARINE,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 6
      })
      await placeShip({
        shipType: SHIP_TYPE.SUBMARINE,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 2,
        coordinateY: 6
      })
      await placeShip({
        shipType: SHIP_TYPE.SUBMARINE,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 4,
        coordinateY: 6
      })
      await placeShip({
        shipType: SHIP_TYPE.SUBMARINE,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 6,
        coordinateY: 6
      })
    }

    it('should return HIT', async () => {
      await prepareBattleField()
      const attackBody = {
        coordinateX: 0,
        coordinateY: 0
      }
      const response = await attack(attackBody)
      expect(response.text).toEqual('HIT')
    })

    it('should return WIN', async () => {
      await prepareBattleField()
      const attacks = [
        [0, 0], [1, 0], [2, 0], [3, 0], [5, 0], [6, 0], [7, 0],
        [0, 2], [1, 2], [2, 2], [5, 2], [6, 2],
        [0, 4], [1, 4], [3, 4], [4, 4],
        [0, 6], [2, 6], [4, 6], [6, 6]
      ]

      let response
      for (let attackData of attacks) {
        response = await attack({
          coordinateX: attackData[0],
          coordinateY: attackData[1]
        })
      }
      expect(response.text).toEqual('WIN')
    })

    it('should return LOST', async () => {
      await prepareBattleField()
      const attackBody = {
        coordinateX: 0,
        coordinateY: 0
      }

      let response
      let i = 0
      while (i < 51) {
        response = await attack(attackBody)
        i++
      }
      expect(response.text).toEqual('You Lost')
    })

    it('should return SANK', async () => {
      await prepareBattleField()
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
