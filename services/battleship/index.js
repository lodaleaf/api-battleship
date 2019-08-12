import _ from 'lodash'

export const initOcean = () => {
  let ocean = Array.from(
    Array(10), () => new Array(10)
  )
  return ocean
}

export const resetGame = () => {

}

export const getOcean = () => {

}

export const getUnitSize = (shipType) => {
  switch (shipType) {
    case 'BATTLE_SHIP':
      return 4
    case 'CRUISER':
      return 3
    case 'DESTROYER':
      return 2
    case 'SUBMARINE':
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
    return ocean[nearbyCoordinateY][nearbyCoordinateX] !== undefined
  })
}

export const putShip = (ocean, shipType, coordinateX, coordinateY, shipDirection) => {
  const beforeAddedOcean = _.cloneDeep(ocean)
  const afterAddedOcean = _.cloneDeep(ocean)
  const unitSize = getUnitSize(shipType)
  for (let i = 0; i < unitSize; i++) {
    let toPutCoordinateX = coordinateX
    let toPutCoordinateY = coordinateY
    if (shipDirection === 'VERTICAL') {
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

export const attack = (coordinate) => {

}
