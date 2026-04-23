import { Ship } from '../Ship';
import { GameBoard } from '../GameBoard';

describe('Placing a ship of length 3 horizontally at [0, 0]', () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = new GameBoard();
    let ship = new Ship(3);
    gameBoard.placeShip(ship, [0, 0], 'horizontal');
  });

  test('board[0][0], board[0][1], and board[0][2] contain a ship object', () => {
    expect(gameBoard.board[0][0]).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][1]).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][2]).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][3]).toBe(null);
  });

  test('Attacking a coordinate that has a ship should increase its hits', () => {
    gameBoard.receiveAttack([0, 0]);

    expect(gameBoard.board[0][0]).toBe('hit');
  });

  test('Attacking a coordinate that is empty should have the cell return "miss"', () => {
    gameBoard.receiveAttack([0, 3]);

    expect(gameBoard.board[0][3]).toBe('miss');
  });

  test('since this is the only ship in this test, attacking only 2 cells should make allSunk() return false', () => {
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);

    expect(gameBoard.allSunk()).toBe(false);
  });

  test('since this is the only ship in this test, attacking each of its 3 cells should make allSunk() return true', () => {
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    gameBoard.receiveAttack([0, 2]);

    expect(gameBoard.allSunk()).toBe(true);
  });

  test('placing another ship where a ship already exists throws an error', () => {
    let ship2 = new Ship(3);

    expect(() => gameBoard.placeShip(ship2, [0, 0], 'vertical')).toThrow(
      "There's already a ship here!"
    );
  });
});

test('placing a ship out of bounds horizontally throws an error', () => {
  let gameBoard = new GameBoard();
  let ship = new Ship(3);
  expect(() => gameBoard.placeShip(ship, [0, 8], 'horizontal')).toThrow(
    'Out of bounds!'
  );
});

test('placing a ship out of bounds vertically throws an error', () => {
  let gameBoard = new GameBoard();
  let ship = new Ship(3);
  expect(() => gameBoard.placeShip(ship, [8, 0], 'vertical')).toThrow(
    'Out of bounds!'
  );
});
