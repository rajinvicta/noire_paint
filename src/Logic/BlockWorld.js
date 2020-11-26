class BlockWorld {
  constructor(config, block, gps, messageCenter) {
    this._config = config;
    this._block = block;
    this._gps = gps;
    this._messageCenter = messageCenter;

    this._bList = [];
    this._invasions = [];
    this._draw = [];
    this._conquestList = [];

    this._allocateData();
    this._addListeners();
  }

  person(x, y, id) {
    let ab = this._getAB(x, y);
    let a = ab.a;
    let b = ab.b;
    let index = this._getIndex(a, b);

    this._occupy(index, id);
  }

  export() {
    return this._filterPainted(this._bList);
  }

  import(bList) {
    for (let c = 0; c < bList.length; c++) {
      let block = bList[c];
      let i = this._getIndex(block.a, block.b);

      this._bList[i] = block;
    }
  }

  extractDraw() {
    let a = this._draw;
    this._draw = []; //draw requested by painter, we don't need it anymore

    return a;
  }

  createNew() {
    let c = this._config.createNew();
    let b = this._block.createNew();
    let g = this._gps.createNew();
    let m = this._messageCenter;

    return new BlockWorld(c, b, g, m);
  }

  initTerritory(player) {
    this._initTerritory(player);
  }

  _addListeners() {
    this._messageCenter.addListner('death', this._kill, this);
  }

  _initTerritory(player) {
    //_getTotalBlockX
    //_getTotalBlockY
    //_getAB
    //_getXYCenter
    //_getIndex

    let totalA = this._getTotalBlockX();
    let totalB = this._getTotalBlockY();
    let a = this._getAB(player.data.x, player.data.y).a;
    let b = this._getAB(player.data.x, player.data.y).b;

    for (let d = (b - 2); d < (b + 2); d++) {
      for (let c = (a - 2); c < (a + 2); c++) {
        let i = this._getIndex(c,d);
        if (this._bList[i] == null) {
          console.log("failed to add at index(%) for a(%s) and b(%s)", i, c, d);
        } else {
          this._bList[i].occupation = player.id;
          this._bList[i].control = player.id;

          this._addConquerList(this._bList[i], player.id);
          this._addDraw(this._bList[i], 0, 0);
        }

      }
    }
  }

  _rndNum(min, max) {
    return (Math.random() * (max - min + 1) ) << 0;
  }

  _kill(data) {
    let id = data.id;

    for (let c = 0; c < this._bList.length; c++) {
      let b = this._bList[c];
      if (b.control == id) b.control = 0;
      if (b.occupation == id) b.occupation = 0;
    }
  }

  _conquer(blocks, id) {
    let isServer = this._isServer();

    for (let c = 0; c < blocks.length; c++) {
      let block = blocks[c];
      block.occupation = id;
      block.control = id;

      if (!isServer) this._addDraw(block);
    }
  }

  _occupy(i, id) {
    let isServer = this._isServer();
    let murder = 0;

    if (this._bList[i].occupation > 0 && this._bList[i].occupation != id) {
      if (this._bList[i].occupation != this._bList[i].control) {
        //murder = this._bList[i].occupation;
        this._sendDeathMessage(this._bList[i].occupation);
      }
    }

    //console.log("murdering: %s", murder);

    if (this._bList[i].occupation != id) {
      this._bList[i].occupation = id;

      this._startInvasion(i, id);

      //console.log(this._invasions);

      if (!isServer) this._addDraw(this._bList[i]);
    } else if (this._bList[i].control == id) {
      this._endInvasion(id);
    }

    return murder;
  }

  _startInvasion(i, id) {
    let currentInvasion = null;
    let block = this._bList[i];

    for (let c = 0; c < this._invasions.length; c++) {
      let invasion = this._invasions[c];
      if (invasion.id == id) currentInvasion = invasion;
    }

    if (currentInvasion != null) {
      if (currentInvasion.startX > block.a) currentInvasion.startX = block.a;
      if (currentInvasion.endX < block.a) currentInvasion.endX = block.a;
      if (currentInvasion.startY > block.b) currentInvasion.startY = block.b;
      if (currentInvasion.endY < block.b) currentInvasion.endY = block.b;

      currentInvasion.occupations.push(i);
    } else {
      currentInvasion = this._createInvasion(id);

      currentInvasion.startX = block.a;
      currentInvasion.endX = block.a;
      currentInvasion.startY = block.b;
      currentInvasion.startY = block.b;

      currentInvasion.occupations.push(i);

      this._invasions.push(currentInvasion);
    }
  }

  _addManyConquers(blocks, id) {
    //console.log("ad many id", id)
    //console.log("ad many", blocks)
    for (let c = 0; c < blocks.length; c++) {
      this._addConquerList(blocks[c], id);
    }
  }

  _addConquerList(block, id) {
    let reqConq = null
    for (let c= 0; c < this._conquestList.length; c++) {
      let conq = this._conquestList[c];
      if (conq.id == id) reqConq = conq;
    }

    if (reqConq != null) {
      reqConq.territory.push(block);
    } else {
      let o = {
        id: id,
        territory: []
      }
      o.territory.push(block);
      this._conquestList.push(o);
    }
  }

  _getTerritoryBounds(id) {
    let player = null;
    let lowestA = 50000;
    let highestA = 0;
    let lowestB = 50000;
    let highestB = 0;

    for (let c = 0; c < this._conquestList.length; c++) {
      if (this._conquestList[c].id == id) player = this._conquestList[c];
    }

    if (player == null) {
      //console.log("returning bascially null")
      return null;
    } else {
      let territory = player.territory;
      for (let c = 0; c < territory.length; c++) {
        let block = territory[c];
        if (block.a < lowestA) lowestA = block.a;
        if (block.b < lowestB) lowestB = block.b;

        if (block.a > highestA) highestA = block.a;
        if (block.b > highestB) highestB = block.b;
      }

      //console.log("ad many 2", {startX: lowestA, endX: highestA, startY: lowestB, endY: highestB})

      return {startX: lowestA, endX: highestA, startY: lowestB, endY: highestB};
    }
  }

  _endInvasion(id) {
    let currentInvasion = null;
    let i = -1;

    for (let c = 0; c < this._invasions.length; c++) {
      let invasion = this._invasions[c];
      if (invasion.id == id) {
        currentInvasion = invasion;
        i = c;
      }
    }

    if (i !== -1) {
      this._invasions.splice(i, 1);
      this._processConquest(currentInvasion);
    }
  }

  _filterPainted(blkList) {
    let list = [];

    for (let c = 0; c < blkList.length; c++) {
      if (blkList[c].occupation != 0) list.push(blkList[c]);
    }

    return list;
  }

  _processConquest(invasionData) {
    let occupations = [];
    for (let c = 0; c < invasionData.occupations.length; c++) {
      occupations.push(this._bList[invasionData.occupations[c]]);
    }

    let terrBounds = this._getTerritoryBounds(invasionData.id);

    //console.log("TERR BOUNDS get ", invasionData.id);

    if (terrBounds != null) {
      if (terrBounds.startX < invasionData.startX) invasionData.startX = terrBounds.startX;
      if (terrBounds.startY < invasionData.startY) invasionData.startY = terrBounds.startY;

      if (terrBounds.endX > invasionData.endX) invasionData.endX = terrBounds.endX;
      if (terrBounds.endY > invasionData.endY) invasionData.endY = terrBounds.endY;
    }

    let conqu = this._calculateConquest(invasionData.startX, invasionData.endX, invasionData.startY, invasionData.endY, invasionData.id);


    ////console.log("Conqu occupations ", occupations);
    this._conquer(occupations, invasionData.id);
    ////console.log("Conqu occupations 2 ", occupations);

    this._conquer(conqu, invasionData.id);

    this._addManyConquers(conqu, invasionData.id);
    this._addManyConquers(occupations, invasionData.id);
  }

  _createInvasion(id) {
    let o = {
      id: id,
      occupations: [],
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }

    return o;
  }

  _allocateData() {
    let e = 0;

    let limX = this._getTotalBlockX();
    let limY = this._getTotalBlockY();

    for (let c = 0; c < limY; c++) {
      for (let d = 0; d < limX; d++) {
        let blk = this._createBlock((e + 1), (c + 1));
        let loc = this._getXYCenter((e + 1), (c + 1));

        blk.centerX = loc.x;
        blk.centerY = loc.y;

        this._bList.push(blk);
        e++;
      }
      e = 0;
    }
  }

  _addDraw(block, dirX=0, dirY=0) {
    let o = {
      block: block,
      dirX: dirX,
      dirY: dirY
    }

    this._draw.push(o);
  }

  _calculateConquest(startA, endA, startB, endB, attackId) {
    let draws = [];

    for (let c = startB; c <= endB; c++) {
      let troopers = this._getBetweenX(startA, endA, c);
      let res = this._checkConquest(troopers, attackId);

      for (let d = 0; d < res.length; d++) {
        draws.push(res[d]);
      }

    }

    return draws;
  }

  _checkConquest(troops, id) {
    let candidates = [];
    let totX = this._getTotalBlockX();
    let totY = this._getTotalBlockY();

    for (let c = 0; c < troops.length; c++){
      let troop = troops[c];

      if (troop.occupation == 0) {
        let troopLeft = this._getBetweenX(1, troop.a - 1, troop.b);
        let troopRight = this._getBetweenX(troop.a + 1, totX, troop.b);
        let troopUp = this._getBetweenY(1, troop.b - 1, troop.a);
        let troopDown = this._getBetweenY(troop.b + 1, totY, troop.a);

        if (this._isOccupiedBy(troopLeft, id) &&
            this._isOccupiedBy(troopRight, id) &&
            this._isOccupiedBy(troopUp, id) &&
            this._isOccupiedBy(troopDown, id))
          {
            candidates.push(troop);
          }
      }
    }

    return candidates;
  }

  _isOccupiedBy(blocks, id) {
    let isOcc = false;

    for (let c = 0; c < blocks.length; c++) {
      let block = blocks[c];
      if (block.occupation == id) isOcc = true;
    }

    return isOcc;
  }

  _getBetweenX(startA, endA, b) {
    let arr = [];

    let totX = this._getTotalBlockX();
    let totY = this._getTotalBlockY();
    let yCont = b - 1;

    for (let c = startA; c <= endA; c++) {
      let i = c + (yCont * totX);
      arr.push(this._bList[i - 1]);
    }

    return arr;
  }

  _getBetweenY(startB, endB, a) {
    let arr = [];

    let totX = this._getTotalBlockX();
    let totY = this._getTotalBlockY();

    for (let c = startB; c <= endB; c++) {
      let yCont = c -1;

      let i = (yCont * totX) + a;

      arr.push(this._bList[i - 1]);
    }

    ////console.log("real bList ", arr);

    return arr;
  }

  _sendDeathMessage(id) {
    this._messageCenter.emit('death', {id: id});
  }

  _getSizeX() {
    return this._config.personX;
  }

  _getSizeY() {
    return this._config.personY;
  }

  _getTotalBlockX() {
    return this._config.totalBlockX;
  }
  _getTotalBlockY() {
    return this._config.totalBlockY;
  }

  _isServer() {
    return this._config.isServer;
  }

  _createBlock(a, b, removeOrder) {
    return this._block.createNew(a, b, removeOrder);
  }

  _getAB(x, y){
    return this._gps.getAB(x, y);
  }

  _getXYCenter(a, b) {
    let blk = this._gps.getBlock(a, b);

    return {x: blk.centerX, y: blk.centerY};
  }

  _getIndex(a, b) {
    let totalX = this._getTotalBlockX();
    let totalY = this._getTotalBlockY();

    return ((b - 1) * totalY) + (a - 1);
  }
}

module.exports = BlockWorld;
