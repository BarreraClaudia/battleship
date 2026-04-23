import { GameBoard } from './GameBoard';

export class Player {
  constructor() {
    this.playerBoard = new GameBoard();
    this.coordsAttacked = [];
  }

  computerRandomAttack() {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    let coords = [row, col];

    let stringCoords = coords.toString();

    if (!this.coordsAttacked.includes(stringCoords)) {
      this.coordsAttacked.push(stringCoords);
      return coords;
    } else {
      return this.computerRandomAttack();
    }
  }
}
