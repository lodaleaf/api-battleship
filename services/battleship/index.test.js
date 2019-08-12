import { initOcean, putShip, isOccupied, getUnitSize, isSank, isReadyToAttack } from './index'
import { SHIP_DIRECTION, SHIP_TYPE } from '../../utils/constants'

describe('initOcean', () => {
  let ocean = initOcean()

  it('return 10 x 10 array', () => {
    expect(ocean[0].length).toEqual(10)
    expect(ocean[1].length).toEqual(10)
  })

  it('return undefined for all coordinate', () => {
    expect(ocean[0][0]).toBeUndefined()
  })
})

describe('putShip', () => {
  it('should be able to put ship with submarine (1 dot)', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.SUBMARINE
    let shipDirection = SHIP_DIRECTION.HORIZONTAL

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection, 1)
    expect(result[0][0]).toEqual(shipType + '_' + 1)
  })

  it('should be able to put ship horizontally', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.HORIZONTAL

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(result[0][0]).toEqual(shipType + '_' + 1)
    expect(result[0][1]).toEqual(shipType + '_' + 1)
    expect(result[0][2]).toEqual(shipType + '_' + 1)
    expect(result[0][3]).toEqual(shipType + '_' + 1)
  })

  it('should be able to put ship vertically', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(result[0][0]).toEqual(shipType + '_' + 1)
    expect(result[1][0]).toEqual(shipType + '_' + 1)
    expect(result[2][0]).toEqual(shipType + '_' + 1)
    expect(result[3][0]).toEqual(shipType + '_' + 1)
  })

  it('should return error because the location already has ship', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(() => {
      putShip(oneShipOcean, SHIP_TYPE.SUBMARINE, 0, 0)
    }).toThrow()
  })

  it('should return error because the location is too near a ship', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(() => {
      putShip(oneShipOcean, SHIP_TYPE.SUBMARINE, 1, 1)
    }).toThrow()
  })

  it('should return error because there is no space in vertical', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    expect(() => {
      putShip(emptyOcean, shipType, 0, 9, shipDirection)
    }).toThrow()
  })

  it('should return error because there is no space in horizontal', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.HORIZONTAL

    expect(() => {
      putShip(emptyOcean, shipType, 9, 0, shipDirection)
    }).toThrow()
  })
})

describe('isOccupied', () => {
  it('should return true', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 0, 0)).toBeTruthy()
  })

  it('should return true', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 1, 1)).toBeTruthy()
  })

  it('should return false', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 9, 9)).toBeFalsy()
  })

  it('should return false', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 5, 5)).toBeFalsy()
  })
})

describe('getUnitSize', () => {
  it('should return 4 for battleship', () => {
    expect(getUnitSize(SHIP_TYPE.BATTLESHIP)).toEqual(4)
  })

  it('should return 3 for cruiser', () => {
    expect(getUnitSize(SHIP_TYPE.CRUISER)).toEqual(3)
  })

  it('should return 2 for destroyer', () => {
    expect(getUnitSize(SHIP_TYPE.DESTROYER)).toEqual(2)
  })

  it('should return 1 for battleship', () => {
    expect(getUnitSize(SHIP_TYPE.SUBMARINE)).toEqual(1)
  })
})

describe('isSank', () => {
  it('should return false', () => {
    let emptyOcean = initOcean()
    let shipType = SHIP_TYPE.BATTLESHIP
    let shipDirection = SHIP_DIRECTION.VERTICAL

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isSank(oneShipOcean, shipType, 1)).toBeFalsy()
  })

  it('should return true', () => {
    let emptyOcean = initOcean()
    expect(isSank(emptyOcean, SHIP_TYPE.BATTLESHIP, 1)).toBeTruthy()
  })
})

describe('isReadyToAttack', () => {
  it('should return true', () => {
    const ocean = [
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
    expect(isReadyToAttack(ocean)).toBeTruthy()
  })

  it('should return false', () => {
    const ocean = [
      SHIP_TYPE.BATTLESHIP + '_' + 1,
      SHIP_TYPE.CRUISER + '_' + 1,
      SHIP_TYPE.CRUISER + '_' + 2,
      SHIP_TYPE.DESTROYER + '_' + 1,
      SHIP_TYPE.DESTROYER + '_' + 2,
      SHIP_TYPE.DESTROYER + '_' + 3,
      SHIP_TYPE.SUBMARINE + '_' + 1,
      SHIP_TYPE.SUBMARINE + '_' + 2,
      SHIP_TYPE.SUBMARINE + '_' + 3
    ]
    expect(isReadyToAttack(ocean)).toBeFalsy()
  })

})
