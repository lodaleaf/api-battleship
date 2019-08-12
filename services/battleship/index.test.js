import { initOcean, putShip, isOccupied, getUnitSize } from './index'

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
    let shipType = 'SUBMARINE'
    let shipDirection = 'HORIZONTAL'

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(result[0][0]).toEqual(shipType)
  })

  it('should be able to put ship horizontally', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'HORIZONTAL'

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(result[0][0]).toEqual(shipType)
    expect(result[0][1]).toEqual(shipType)
    expect(result[0][2]).toEqual(shipType)
    expect(result[0][3]).toEqual(shipType)
  })

  it('should be able to put ship vertically', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let result = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(result[0][0]).toEqual(shipType)
    expect(result[1][0]).toEqual(shipType)
    expect(result[2][0]).toEqual(shipType)
    expect(result[3][0]).toEqual(shipType)
  })

  it('should return error because the location already has ship', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(() => {
      putShip(oneShipOcean, 'SUBMARINE', 0, 0)
    }).toThrow()
  })

  it('should return error because the location is too near a ship', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(() => {
      putShip(oneShipOcean, 'SUBMARINE', 1, 1)
    }).toThrow()
  })

  it('should return error because there is no space in vertical', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    expect(() => {
      putShip(emptyOcean, shipType, 0, 9, shipDirection)
    }).toThrow()
  })

  it('should return error because there is no space in horizontal', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'HORIZONTAL'

    expect(() => {
      putShip(emptyOcean, shipType, 9, 0, shipDirection)
    }).toThrow()
  })
})

describe('isOccupied', () => {
  it('should return true', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 0, 0)).toBeTruthy()
  })

  it('should return true', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 1, 1)).toBeTruthy()
  })

  it('should return false', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 9, 9)).toBeTruthy()
  })

  it('should return false', () => {
    let emptyOcean = initOcean()
    let shipType = 'BATTLE_SHIP'
    let shipDirection = 'VERTICAL'

    let oneShipOcean = putShip(emptyOcean, shipType, 0, 0, shipDirection)
    expect(isOccupied(oneShipOcean, 5, 5)).toBeFalsy()
  })
})

describe('getUnitSize', () => {
  it('should return 4 for battleship', () => {
    expect(getUnitSize('BATTLE_SHIP')).toEqual(4)
  })

  it('should return 3 for cruiser', () => {
    expect(getUnitSize('CRUISER')).toEqual(3)
  })

  it('should return 2 for battleship', () => {
    expect(getUnitSize('DESTROYER')).toEqual(2)
  })

  it('should return 1 for battleship', () => {
    expect(getUnitSize('SUBMARINE')).toEqual(1)
  })
})
