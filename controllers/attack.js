import { attack as attackService, getOrCreateActiveOcean } from '../services/battleship'

export const attack = async (req, res) => {
  try {
    const coordinateX = req.body.coordinateX
    const coordinateY = req.body.coordinateY

    const activeOcean = await getOrCreateActiveOcean()
    if (!activeOcean.ready_to_attack) {
      throw (new Error('Please place all ships'))
    }

    if (activeOcean.tries === 0) {
      throw (new Error('You Lost'))
    }
    const attackStatus = await attackService(coordinateX, coordinateY)
    res.send(attackStatus)
  } catch (e) {
    res.status(400)
    res.send(e.message)
  }
}
