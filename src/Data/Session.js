class Session {
  constructor(config, messageCenter) {
    this._config = config;
    this._messageCenter = messageCenter;

    this._world = null;
    this._persons = [];
    this._lastId = 0; //player

    this._id = Symbol();

    this._state = null;

    this._addListeners();
  }

  get id() {
    return this._id;
  }

  get totalPlayers() {
    return this._persons.length;
  }

  get blockWorld() {
    return this._world;
  }

  get persons() {
    return this._persons;
  }

  set blockWorld(bw) {
    this._world = bw;
  }

  get state() {
    return this._state;
  }

  export() {
    return this._world.export();
  }

  import(bList) {
    this._world.import(bList);
  }

  saveState() {
    this._state = this.export();
  }

  addPlayer(player, label, id=0) {
    this._lastId++;
    let targetId = this._lastId;

    if (id > 0) {
      targetId = id;

      if (id >= this._lastId) this._lastId = id + 1;

      //console.log('forcing id %s, lastId %s', id, this._lastId);
    }

    let p = this._createPerson(player, targetId, label);

    this._persons.push(p);

    this._world.initTerritory(p);

    return this._lastId;
  }

  personPosition(x, y, id) {
    this._world.person(x, y, id);

    if (this._isDeadEnd(x, y).check) this._sendDeathMessage(id);
  }

  removePlayer(id) {
    for (let c = 0; c < this._persons.length; c++) {
      //add logic here
    }
  }

/*
  recycle() {
    let arr = this._persons;
    let c = arr.length;
    let arrSnd = [];

    while (c--) {
      if (arr[c].data.pendingDeath) {
        arr[c].data.destroy();
        arrSnd.push(arr[c].id);
        arr.splice(c, 1);
      }
    }

    return arrSnd;
  }
*/

  createNew() {
    return new Session(this._config, this._messageCenter);
  }

  _addListeners() {
    this._messageCenter.addListner('death', this._murderPlayer, this);
  }

  _murderPlayer(data) {
    let id = data.id;
    let arr = this._persons;
    let c = arr.length;

    while (c--) {
      let person = arr[c];
      if (person.id == id) {
        person.data.destroy();
        arr.splice(c, 1);
      }
    }
  }

  _sendDeathMessage(id) {
    this._messageCenter.emit('death', {id: id});
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

  _createPerson(player, id, label) {
    return {
      data: player,
      id: id,
      label: label
    };
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

module.exports = Session;
