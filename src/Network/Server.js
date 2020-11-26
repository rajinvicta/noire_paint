class Server {
  constructor(socket, config, auth, gps, delayLoop, delayLoop2, person, sessionManager, messageCenter) {
    this._socket = socket;
    this._config = config;
    this._auth = auth;
    this._gps = gps;
    this._delayLoop = delayLoop;
    this._updateLoop = delayLoop2;
    this._person = person;
    this._sessionManager = sessionManager;
    this._messageCenter = messageCenter;

    this._persons = [];
    this._deathList = [];
    this._counter = 0;

    this._addListeners();
  }

  start() {
    this._socket.start(5000, this._onConnection, this._onMessage, this._onClose, this);

    this._initUpdates();
  }

  _initUpdates() {
    this._delayLoop.addFunction(this._updateChildren, this);
    this._updateLoop.addFunction(this._update, this);

    this._delayLoop.start(100);
    this._updateLoop.start(16.666666667);
  }

  _addListeners() {
    this._messageCenter.addListner('death', (data) => {
      //console.log("Person Size: %s", this._persons.length);
      this._endConnections([data.id]);
      this._deathList.push(data.id);
    }, this);
  }

  _endConnections(idList) {
    for (let c = 0; c < idList.length; c++) {
      let id = idList[c];
      let arr = this._persons;
      let d = arr.length;

      while (d--) {
        if (arr[d].id == idList) {
          arr.splice(d, 1);
        }
      }
    }
  }

  _update() {
    this._sessionManager.update();
    //let toDelete = this._sessionManager.recycle();
    //if (toDelete.length > 0) this._endConnections(toDelete);
  }

  _updateChildren() {
    let isWorldData = false;

    this._counter++;

    //Update blocks to the system once every 1.5 seconds
    if (this._counter == 15) {
      this._sessionManager.saveStates();

      isWorldData = true;
      this._counter = 0;
    }

    this._informPlayers(isWorldData);
  }

  _informPlayers(isWorldData=false) {
    let playerCache = this._getPlayerCache();

    for (let c = 0; c < this._persons.length; c++) {
      let pObj = this._persons[c];
      let socket = pObj.socket;

      if (isWorldData) {
        let session = pObj.session;
        this._updateSocket(socket, {players: playerCache, world: session.state}, 'update');
        this._updateSocket(socket, {deaths: this._deathList}, 'kills');
      } else {
        this._updateSocket(socket, {players: playerCache, world: null}, 'update');
      }
    }
  }

  _getPlayerCache() {
    let arr = [];

    for (let c = 0; c < this._persons.length; c++) {
      let pObj = this._persons[c];
      let person = pObj.data;
      let moves = person.export();
      let id = pObj.id;
      let label = pObj.label;

      arr.push({id: id, label: label, movement: moves, x: person.x, y: person.y});
    }

    return arr;
  }

  _addPerson(socket) {
    let label = 'rudrabhoj';
    let position = this._getRandomPlace();

    let p = this._person.createNew();
    p.init(null, label, position.x, position.y);

    let sessionData = this._sessionManager.addPerson(p, label);

    let pObj = this._createPerson(p, sessionData.pid, label, socket, sessionData.session);

    console.log("pid ", sessionData.pid);

    this._persons.push(pObj);

    return pObj;
  }

  _onConnection(socket) {
    console.log("We have recieved a connection!");
    let p = this._addPerson(socket);
    let world = p.session.export();
    let players = this._getAllPlayers(p.session);

    this._updateSocket(socket, {world: world, token: p.token, playerId: p.id, playerLabel: p.label, playerX: p.data.x, playerY: p.data.y, playerList: players}, "init");
  }

  _onMessage(e) {
    let type = e.type;

    if (type == 'playerUpdate') this._playerUpdate(e.data, e.auth);
  }

  _playerUpdate(data, token) {
    for (let c = 0; c < this._persons.length; c++) {
      let person = this._persons[c];

      if (person.token == token) {
        person.data.import(data);
      }
    }
  }

  _updateSocket(socket, data, type) {
    this._socket.sendUpdate(socket, data, type);
  }

  _getRandomPlace() {
    let maxX = this._getTotalBlockX();
    let maxY = this._getTotalBlockY();

    let a = this._rndNum(15, maxX - 15);
    let b = this._rndNum(15, maxY - 15);

    let block = this._gps.getBlock(a, b);

    return {x: block.centerX, y: block.centerY};
  }

  _onClose(socket) {
    let arr = this._persons;
    let c = arr.length;

    while (c--) {
      let person = arr[c];

      if (person.socket.gzpId == socket.gzpId) {
        let id = person.id;
        this._sendDeathMessage(id);
        arr.splice(c, 1);
        console.log("removing socket with id %s", socket.gzpId);
      }

    }
  }

  _sendDeathMessage(id) {
    this._messageCenter.emit('death', {id: id});
  }

  _createPerson(data, id, label, socket, session) {
    return {
      data: data,
      id: id,
      label: label,
      socket: socket,
      session: session,
      token: this._getRandomToken()
    }
  }

  _rndNum(min, max) {
    return (Math.random() * (max - min + 1) ) << 0;
  }

  _getAllPlayers(session) {
    let players = session.persons;
    let sndArr = [];

    for (let c = 0; c < players.length; c++) {
      let person = players[c];
      let movement = person.data.export();

      sndArr.push({id: person.id, label: person.label, movement: movement})
    }

    return sndArr;
  }

  _getTotalBlockX() {
    return this._config.totalBlockX;
  }

  _getTotalBlockY() {
    return this._config.totalBlockY;
  }

  _getRandomToken() {
    return this._auth.getRandomToken();
  }
}

module.exports = Server;
