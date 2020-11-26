class Block {
  constructor() {
    this._a = 1;
    this._b = 1;
    this._centerX = 0;
    this._centerY = 0;
    this._occupation = 0;
    this._control = 0;
    this._removeOrder = 0;
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  get occupation() {
    return this._occupation;
  }

  get control() {
    return this._control;
  }

  get centerX() {
    return this._centerX;
  }

  get centerY() {
    return this._centerY;
  }

  get removeOrder() {
    return this._removeOrder;
  }

  set occupation(ocu) {
    this._occupation = ocu;
  }

  set control(con) {
    this._control = con;
  }

  set centerX(cX) {
    this._centerX = cX;
  }

  set centerY(cY) {
    this._centerY = cY;
  }

  createNew(a=1, b=1, removeOrder=0) {
    let blk = new Block();
    blk._a = a;
    blk._b = b;
    blk._removeOrder = removeOrder;

    return blk;
  }
}

module.exports = Block;
