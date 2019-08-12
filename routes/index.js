import { Router } from 'express'
import controllers from '../controllers'

const router = new Router()

router.get('/api/', function (req, res) {
  controllers.getCurrentOcean(req, res)
})

router.get('/api/reset', function (req, res) {
  controllers.resetGame(req, res)
})

router.post('/api/ship', function (req, res) {
  controllers.placeShip(req, res)
})

router.post('/api/attack', function (req, res) {
  controllers.attack(req, res)
})

export default router
