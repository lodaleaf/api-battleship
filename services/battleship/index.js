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
    active: true,
    ready_to_attack: false,
    tries: 50
  })
  await newOcean.save()
  return newOcean
}

export const getUnitSize = (shipType) => {
  switch (shipType) {
    case SHIP_TYPE.BATTLESHIP:
      return 4
    case SHIP_TYPE.CRUISER:
      return 3
    case SHIP_TYPE.DESTROYER:
      return 2
    case SHIP_TYPE.SUBMARINE:
      return 1
  }
}

export const getUnitAmount = (shipType) => {
  switch (shipType) {
    case SHIP_TYPE.BATTLESHIP:
      return 1
    case SHIP_TYPE.CRUISER:
      return 2
    case SHIP_TYPE.DESTROYER:
      return 3
    case SHIP_TYPE.SUBMARINE:
      return 4
  }
}

export const checkAndGetShipNumber = (ocean, shipType) => {
  const unitAmount = getUnitAmount(shipType)
  let shipNumber = 1
  while (unitAmount >= shipNumber) {
    if (isShipPlaced(ocean, shipType, shipNumber)) {
      shipNumber++
    } else {
      return shipNumber
    }
  }
  throw Error('Number of ship exceeds')
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

export const putShip = (ocean, shipType, coordinateX, coordinateY, shipDirection, shipNumber = 1) => {
  const beforeAddedOcean = _.cloneDeep(ocean)
  const afterAddedOcean = _.cloneDeep(ocean)
  const unitSize = getUnitSize(shipType)
  shipNumber = checkAndGetShipNumber(ocean, shipType)
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

    afterAddedOcean[toPutCoordinateY][toPutCoordinateX] = shipType + '_' + shipNumber
  }
  return afterAddedOcean
}

export const attack = async (coordinateX, coordinateY) => {
  let activeOcrean = await getOrCreateActiveOcean()
  let attackStatus = ''
  const oceanData = _.cloneDeep(activeOcrean.ocean_data)
  if (!_.isNil(oceanData[coordinateY][coordinateX])) {
    let shipType = oceanData[coordinateY][coordinateX].split('_')[0]
    let shipNumber = oceanData[coordinateY][coordinateX].split('_')[1]
    oceanData[coordinateY][coordinateX] = STATE.HIT
    attackStatus = STATE.HIT

    if (isSank(oceanData, shipType, shipNumber)) {
      attackStatus = STATE.SANK
    }

    if (isWin(oceanData)) {
      attackStatus = STATE.WIN
    }
  }
  activeOcrean.ocean_data = oceanData
  activeOcrean.tries--
  await activeOcrean.save()
  return attackStatus
}

export const isSank = (ocean, shipType, shipNumber) => (
  _.flatten(ocean).indexOf(shipType + '_' + shipNumber) === -1
)

export const isReadyToAttack = (ocean) => {
  const expected = [
    SHIP_TYPE.BATTLESHIP + '_' + 1,
    SHIP_TYPE.CRUISER + '_' + 1,
    SHIP_TYPE.CRUISER + '_' + 2,
    SHIP_TYPE.DESTROYER + '_' + 1,
    SHIP_TYPE.DESTROYER + '_' + 2,
    SHIP_TYPE.DESTROYER + '_' + 3,
    SHIP_TYPE.SUBMARINE + '_' + 1,
    SHIP_TYPE.SUBMARINE + '_' + 2,
    SHIP_TYPE.SUBMARINE + '_' + 3,
    SHIP_TYPE.SUBMARINE + '_' + 4
  ]
  return _.isEqual(
    _.compact(
      _.uniq(
        _.flatten(ocean)
      )
    ), expected)
}

export const isShipPlaced = (ocean, shipType, shipNumber) => (
  _.flatten(ocean).indexOf(shipType + '_' + shipNumber) !== -1
)

export const isWin = (ocean) => {
  const allStates = _.compact(
    _.uniq(
      _.flatten(ocean)
    )
  )
  return allStates.length === 1 && allStates[0] === STATE.HIT
}
