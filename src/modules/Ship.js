export class Ship {
  constructor(shipLength) {
    this.shipLength = shipLength;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.shipLength === this.hits;
  }
}
