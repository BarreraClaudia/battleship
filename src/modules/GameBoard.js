import { Ship } from './Ship';

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];
  }

  placeShip(ship, [row, col], direction) {
    // validate first, place nothing yet
    if (direction === 'horizontal') {
      if (col + ship.shipLength > 10) throw new Error('Out of bounds!');
      for (let i = col; i < col + ship.shipLength; i++) {
        if (this.board[row][i] instanceof Ship)
          throw new Error("There's already a ship here!");
      }
      // only place if all checks passed
      for (let i = col; i < col + ship.shipLength; i++) {
        this.board[row][i] = ship;
      }
    } else if (direction === 'vertical') {
      if (row + ship.shipLength > 10) throw new Error('Out of bounds!');
      for (let i = row; i < row + ship.shipLength; i++) {
        if (this.board[i][col] instanceof Ship)
          throw new Error("There's already a ship here!");
      }
      // only place if all checks passed
      for (let i = row; i < row + ship.shipLength; i++) {
        this.board[i][col] = ship;
      }
    }

    this.ships.push(ship);
  }

  receiveAttack([row, col]) {
    if (this.board[row][col] instanceof Ship) {
      this.board[row][col].hit();
      this.board[row][col] = 'hit';
    } else if (this.board[row][col] === null) {
      this.board[row][col] = 'miss';
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
