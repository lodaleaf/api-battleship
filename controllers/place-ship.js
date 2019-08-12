import { putShip, getOrCreateActiveOcean, isReadyToAttack } from '../services/battleship'

export const placeShip = async (req, res) => {
  try {
    const shipType = req.body.shipType
    const shipDirection = req.body.shipDirection
    const coordinateX = req.body.coordinateX
    const coordinateY = req.body.coordinateY

    let activeOcean = await getOrCreateActiveOcean()
    activeOcean.ocean_data = putShip(activeOcean.ocean_data, shipType, coordinateX, coordinateY, shipDirection)
    if (isReadyToAttack(activeOcean.ocean_data)) {
      activeOcean.ready_to_attack = true
    }
    await activeOcean.save()
    return res.send('Placed')
  } catch (e) {
    res.status(400)
    res.send(e.message)
  }
}
