import _ from 'lodash'
import OceanModel from '../../schema/ocean'
import { SHIP_DIRECTION, SHIP_TYPE, STATE } from '../../utils/constants'

export const initOcean = () => {
  let ocean = Array.from(
    Array(10), () => new Array(10)
  )
  return ocean
}

export const resetOcean = async () => {
  await OceanModel.deactiveAll()
}

export const getOrCreateActiveOcean = async () => {
  let activeOcean = await OceanModel.findActive()

  if (_.isNil(activeOcean)) {
    activeOcean = await createActiveOcean()
  }
  return activeOcean
}

export const createActiveOcean = async () => {
  let newOceanData = initOcean()
  let newOcean = new OceanModel({
    ocean_data: newOceanData,
    active: true
  })
  await newOcean.save()
  return newOcean
}

export const getUnitSize = (shipType) => {
  switch (shipType) {
    case SHIP_TYPE.BATTLE_SHIP:
      return 4
    case SHIP_TYPE.CRUISER:
      return 3
    case SHIP_TYPE.DESTROYER:
      return 2
    case SHIP_TYPE.SUBMARINE:
      return 1
  }
}

export const getSaftyCoodinate = (coordinate) => {
  if (coordinate > 9) {
    return 9
  }

  if (coordinate < 0) {
    return 0
  }

  return coordinate
}

export const isOccupied = (ocean, coordinateX, coordinateY) => {
  const nearbyOffset = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [0, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ]
  return _.some(nearbyOffset, (offset) => {
    const nearbyCoordinateX = getSaftyCoodinate(offset[0] + coordinateX)
    const nearbyCoordinateY = getSaftyCoodinate(offset[1] + coordinateY)
    return !_.isNil(ocean[nearbyCoordinateY][nearbyCoordinateX])
  })
}

export const putShip = (ocean, shipType, coordinateX, coordinateY, shipDirection) => {
  const beforeAddedOcean = _.cloneDeep(ocean)
  const afterAddedOcean = _.cloneDeep(ocean)
  const unitSize = getUnitSize(shipType)
  for (let i = 0; i < unitSize; i++) {
    let toPutCoordinateX = coordinateX
    let toPutCoordinateY = coordinateY
    if (shipDirection === SHIP_DIRECTION.VERTICAL) {
      toPutCoordinateY += i
    } else {
      toPutCoordinateX += i
    }

    if (toPutCoordinateY > 9 || toPutCoordinateX > 9) {
      throw (new Error('There is no space left'))
    }

    if (isOccupied(beforeAddedOcean, toPutCoordinateX, toPutCoordinateY)) {
      throw (new Error('This location is occupied'))
    }

    afterAddedOcean[toPutCoordinateY][toPutCoordinateX] = shipType
  }
  return afterAddedOcean
}

export const attack = async (coordinateX, coordinateY) => {
  let activeOcrean = await getOrCreateActiveOcean()
  let attackStatus = ''
  const oceanData = _.cloneDeep(activeOcrean.ocean_data)
  if (!_.isNil(oceanData[coordinateY][coordinateX])) {
    let shipType = oceanData[coordinateY][coordinateX]
    oceanData[coordinateY][coordinateX] = STATE.HIT
    attackStatus = STATE.HIT

    if (isSank(oceanData, shipType)) {
      attackStatus = STATE.SANK
    }
  }
  activeOcrean.ocean_data = oceanData
  await activeOcrean.save()
  return attackStatus
}

export const isSank = (ocean, shipType) => (
  _.flatten(ocean).indexOf(shipType) === -1
)
