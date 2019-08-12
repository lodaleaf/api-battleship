import request from 'supertest'
import { SHIP_DIRECTION, SHIP_TYPE } from '../utils/constants'
import app from '../app'

// const resetGame = () => (request(app).get('/api/reset'))
// const placeShip = (body) => (request(app).get('/api/reset').send(body))

describe('controllers', () => {
  describe('get current ocean controller', () => {
    it('should return ocean data', (done) => {
      request(app)
        .get('/api')
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.status).toEqual(200)
          expect(JSON.parse(res.text).ocean_data.length).toEqual(10)
          done()
        })
    })
  })

  describe('place-ship controller', () => {
    xit('should succeed place a ship', (done) => {
      const reqBody = {
        shipType: SHIP_TYPE.BATTLE_SHIP,
        shipDirection: SHIP_DIRECTION.HORIZONTAL,
        coordinateX: 0,
        coordinateY: 0
      }
      request(app)
        .post('/api/ship')
        .send(reqBody)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.status).toEqual(200)
          expect(res.text).toEqual('Placed')
          done()
        })
    })
  })
})
