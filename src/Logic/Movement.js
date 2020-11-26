class Movement {
  constructor(config, accuTime, gps) {
    this._config = config;
    this._accuTime = accuTime;
    this._gps = gps;

    this._speed = 250;
    this._moveList = [];

    this._command = 0;
  }

  addMove(x, y, type, time) {
    let move = {x: x, y: y, time: time, xSpeed: 0, ySpeed: 0, command: this._command};

    this._command++;

    if (type == 'left') {
      move.xSpeed = -1;
      move.ySpeed = 0;
    } else if (type == 'right') {
      move.xSpeed = 1;
      move.ySpeed = 0;
    } else if (type == 'up') {
      move.xSpeed = 0;
      move.ySpeed = -1;
    } else if (type == 'down') {
      move.xSpeed = 0;
      move.ySpeed = 1;
    }

    setTimeout(() => {
      this._addMove(move);
    }, 150);

    return 0;
  }

  export() {
    return this._moveList;
  }

  import(mvList) {
    this._moveList = mvList;
  }

  getPosition() {
    let lim = this._moveList.length;
    if (lim <= 0) return null;

    let posX = this._moveList[0].x;
    let posY = this._moveList[0].y;

    for (let c = 0; c < (lim - 1); c++) {
      let move = this._moveList[c];
      let next = this._moveList[c + 1];

      let elapsed = (next.time - move.time) / 1000;

      posX = posX + (elapsed * this._speed * move.xSpeed);
      posY = posY + (elapsed * this._speed * move.ySpeed);

      if (move.ySpeed != 0) {
        //posX = this._correctX(posX, posY);
      } else {
        //posY = this._correctY(posX, posY);
      }
    }

    let move = this._moveList[lim - 1];
    let correctionNeeded = 0;

    //if (move.time <= this._getTime()) {
    if (true) {
      let elapsed = (this._getTime() - move.time) / 1000;

      posX = posX + (elapsed * this._speed * move.xSpeed);
      posY = posY + (elapsed * this._speed * move.ySpeed);


      if (move.ySpeed != 0) {
        let correctPosX = this._correctX(posX, posY);
        correctionNeeded = Math.abs(correctPosX - posX);
        posX = this._correctX(posX, posY);
        //console.log("correct X(%s) vs X(%s)", this._correctX(posX, posY), posX);

        //console.log("correctionNeeded: %s", correctionNeeded);
      } else {
        let correctPosY = this._correctY(posX, posY);
        correctionNeeded = Math.abs(correctPosY - posY);
        posY = this._correctY(posX, posY);
      }
    }

    let isDeadEnd = this._isDeadEnd(posX, posY);
    if (isDeadEnd.check) return {x: isDeadEnd.x, y: isDeadEnd.y, correction: 0, isDead: true};

    return {x: posX, y: posY, correction: correctionNeeded, isDead: false};
  }

  createNew() {
    let a = this._accuTime.createNew();
    let g = this._gps.createNew();

    return new Movement(this._config, a, g);
  }

  _isDeadEnd(x, y) {
    let bW = this._personX();
    let bH = this._personY();
    let totalX = this._totalBlockX();
    let totalY = this._totalBlockY();

    let minX = bW / 2;
    let minY = bH / 2;
    let maxX = bW * (totalX - 0.5);
    let maxY = bH * (totalY - 0.5);

    //console.log("x: %s, y: %s, minX: %s, minY: %s, maxX: %s, maxY: %s", x, y, minX, minY, maxX, maxY);

    if (x <= minX) return {check: true, x: minX, y: y};
    if (y <= minY) return {check: true, x: x, y: minY};
    if (x >= maxX) return {check: true, x: maxX, y: y};
    if (y >= maxY) return {check: true, x: x, y: maxY};



    return {check: false, x: null, y: null};
  }

  _removeTop() {
    let lim = this._moveList.length;

    let posX = this._moveList[0].x;
    let posY = this._moveList[0].y;

    let move = this._moveList[0];
    let next = this._moveList[1];

    let elapsed = (next.time - move.time) / 1000;

    posX = posX + (elapsed * this._speed * move.xSpeed);
    posY = posY + (elapsed * this._speed * move.ySpeed);

    next.x = posX;
    next.y = posY;

    this._moveList.shift();
  }

  _addMove(move) {
    let addedTime = 0;

    if (this._moveList.length != 0) {
      move.x = 0;
      move.y = 0;

      let correction = this.getPosition().correction;
      addedTime = Math.round(((correction / this._speed) * 1000));

      //console.log("correctionNeeded: %s, time: %s", this.getPosition().x, this.getPosition().y);
    }

    setTimeout(() => {
      move.time = this._getTime();
      if (this._moveList.length == 5) this._removeTop();

      this._moveList.push(move);
    }, addedTime);

    return addedTime;
  }

  _getTime() {
    return this._accuTime.getTime();
  }

  _correctX(x, y) {
    return this._gps.correctPosition(x, y).x;
  }

  _correctY(x, y) {
    //console.log("correcting ", y);
    return this._gps.correctPosition(x, y).y;
  }

  _personX() {
    return this._config.personX;
  }
  _personY() {
    return this._config.personY;
  }
  _totalBlockX() {
    return this._config.totalBlockX;
  }
  _totalBlockY() {
    return this._config.totalBlockY;
  }
}

module.exports = Movement;
