import { attack as attackService } from '../services/battleship'

export const attack = async (req, res) => {
  try {
    const coordinateX = req.body.coordinateX
    const coordinateY = req.body.coordinateY

    const attackStatus = await attackService(coordinateX, coordinateY)
    res.send(attackStatus)
  } catch (e) {
    res.status(400)
    res.send(e.message)
  }
}
