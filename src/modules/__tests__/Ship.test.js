import { Ship } from '../Ship';

describe('Ship of length 3', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('ship starts with 0 hits', () => {
    expect(ship.hits).toBe(0);
  });

  test('a ship of length 3, calls hit() twice, so hits should return 2', () => {
    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(2);
  });

  test('a ship of length 3 is hit twice, so it should not be sunk', () => {
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(false);
  });
});

describe('Ship of length 2', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2);
  });

  test('a ship of length 2 is hit twice, so it should be sunk', () => {
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });
});
