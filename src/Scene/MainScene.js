class MainScene {
  constructor(scene, connection, camera, delayLoop, sessionManager, messageCenter, color, player, person, wall) {
    this._scene = scene;
    this._connection = connection;
    this._camera = camera;
    this._delayLoop = delayLoop;
    this._sessionManager = sessionManager;
    this._messageCenter = messageCenter;
    this._color = color;
    this._player = player;
    this._person = person;
    this._wall = wall;

    this._data = null;
    this._sessionId = null;
    this._lastPlayerExport = null;

    this._loaded = false;
    this._authToken = "";
    this._id = 0;

    this._deathList = [];

    this._initScene();
  }

  get data() {
    return this._data;
  }

  _preload() {

  }

  _create() {
    this._connection.start(this._onMsg, this);
  }

  _startCreate(e) {
    console.log("MainScene created!");

    let initData = e;

    this._authToken = initData.token;

    this._player.init(this._data, initData.playerLabel, initData.playerX, initData.playerY);

    console.log(initData);

    let sp = this._sessionManager.addPerson(this._player, initData.playerLabel, initData.playerId);
    this._id = initData.playerId;

    console.log("sp", sp);

    this._sessionId = sp.sid;

    this._camera.updateSize(this._data);
    this._camera.playerPos(this._data, this._player); //Very hackish

    this._delayLoop.addFunction(this._updateServer, this);
    this._delayLoop.start(100);

    this._wall.init(this._data);
  }

  _onMsg(e) {
    let type = e.type;

    if (type == 'init') {
      this._loaded = true;
      this._startCreate(e);
    } else if (type == 'update') {
      this._syncServer(e);
      if (e.world != null) this._fixDrawGaps(e.world);
    } else if (type == 'kills') {
      this._updateKill(e.deaths);
    }
  }

  _update() {
    if (!this._loaded) return;

    this._sessionManager.update();

    let draws = this._sessionManager.getDraws(this._sessionId);

    if (draws != null) this._updateMap(draws);
  }

  _updateServer() {
    if (!this._loaded) return;
    if (this._player.destroyed) return;

    if (!this._player.pendingDeath) {
      let exprt = this._player.export();
      if (JSON.stringify(exprt) != JSON.stringify(this._lastPlayerExport)) {
        this._lastPlayerExport = [].concat(exprt);
        if (exprt.length > 0) this._sendData(exprt, 'playerUpdate');
      } else {
        //console.log("not exporting data");
        //console.log(exprt, "=", this._lastPlayerExport);
      }
    }
  }

  _deathListExists(id) {
    let ext = false;

    for (let c = 0; c < this._deathList.length; c++) {
      if (this._deathList[c] ==  id) ext = true;
    }

    return ext;
  }

  _updateKill(deaths) {
    for (let c = 0; c < deaths.length; c++) {
      let dth = deaths[c];
      if (!this._deathListExists(dth)) {
        this._emitKill(dth);
        this._deathList.push(dth);
      }
    }
  }

  _emitKill(id) {
    this._messageCenter.emit('death', {id: id});
  }

  _syncServer(e) {
    let players = e.players;
    for (let c = 0; c < players.length; c++) {
      let player = players[c];
      let id = player.id;
      let label = player.label;
      let movement = player.movement;
      let x = player.x;
      let y = player.y;

      if (id != this._id) {
        let target = this._sessionManager.getPersonById(this._sessionId, id);

        if (target != null) {
          target.import(movement);
        } else {
          //console.log("e", e);
          let newGuy = this._person.createNew();
          newGuy.init(this._data, label, x, y);
          let sp = this._sessionManager.addPerson(newGuy, label, id);
          let target2 = this._sessionManager.getPersonById(this._sessionId, id);

          target2.import(movement);

          console.log('my x: %s my y: %s | targetXY %s, %s', this._player.x, this._player.y, x, y);
        }
      }
    }
  }

  _fixDrawGaps(data) {
    return;
    let drawGaps = this._color.filterGaps(data);

    if (drawGaps.length > 0)  {
      let c = drawGaps.length;

      while (c--) {
        drawGaps[c].a = drawGaps[c]._a;
        drawGaps[c].b = drawGaps[c]._b;
        drawGaps[c].occuation = drawGaps[c]._occupation;
        drawGaps[c].control = drawGaps[c]._control;

        drawGaps[c].centerX = drawGaps[c]._centerX;
        drawGaps[c].centerY = drawGaps[c]._centerY;
        drawGaps[c].removeOrder = drawGaps[c]._removeOrder;

        let blk = drawGaps[c];

        if (drawGaps[c].occupation == null && drawGaps[c].control == null) {
          drawGaps.splice(c, 1);
        } else {
          drawGaps[c] = {block: blk, dirX: 0, dirY: 0};
        }

      }

      this._updateMap(drawGaps);
    }

  }

  _shutdown() {
    console.log("MainScene dead");
    this._delayLoop.clearAll();
  }

  _updateMap(draws) {
    let personList = this._sessionManager.getPersons(this._sessionId);

    for (let c = 0; c < draws.length; c++) {
      let block = draws[c];
      //console.log(block);
      this._drawBlock(block, personList);
    }
  }

  _sendData(data, type) {
    let auth = this._authToken;
    this._connection.send({data: data, auth: auth, type: type});
  }

  _drawBlock(block, personList) {
    this._color.draw(block, this._data, personList);
  }


  _initScene() {
    this._data = this._createScene('MainScene', this._preload, this._create, this._update);
  }

  _createScene(key, preload, create, update) {
    return this._scene.createScene(key, preload, create, update, this);
  }
}

module.exports = MainScene;
