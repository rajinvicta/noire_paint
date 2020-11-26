class GPS {
  constructor() {
    this._blockX = 50;
    this._blockY = 50;
  }

  //starts from 1
  getBlock(a, b) {
    let o = {
      x1: (a - 1) * this._blockX,
      y1: (b - 1) * this._blockY,
      x2: (a) * this._blockX,
      y2: (b) * this._blockY,
      centerX: 0,
      centerY: 0
    }

    o.centerX = o.x1 + (this._blockX / 2);
    o.centerY = o.y1 + (this._blockY / 2);

    return o;
  }

  correctPosition(x, y) {
    let ab = this._getAB(x, y);
    let block = this.getBlock(ab.a, ab.b);

    return {x: block.centerX, y: block.centerY}
  }

  getAB(x, y) {
    return this._getAB(x, y);
  }

  createNew() {
    return new GPS();
  }

  _getAB(x, y) {
    let a = this._approximateBlock(x / this._blockX);
    let b = this._approximateBlock(y / this._blockY);

    return {a: a, b: b}
  }

  _approximateBlock(n) {
    return Math.ceil(n);
  }
}

module.exports = GPS;
