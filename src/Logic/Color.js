class Color {
  constructor(config, entity, messageCenter) {
    this._config = config;
    this._entity = entity;
    this._messageCenter = messageCenter;

    this._storage = [];
    this._unused = [];
    this._active = [];

    this._addListeners();
  }

  draw(target, scene, personList) {
    let block = target.block;
    let dirX = target.dirX;
    let dirY = target.dirY;

    //console.log(block.centerX);

    if (block.occupation != 0 && block.control == block.occupation) {
      let ent = this._entity.createNew(block.centerX, block.centerY, 0, 0);
      //ent.initSprite(scene, 'rudrabhoj_control');
      ent.initSprite(scene, this._getControl(block.control, personList));
      ent.startX = 0.5;
      ent.startY = 0.5;
      this._storage.push({data: ent, a: block.a, b: block.b, id: block.occupation, occupation: block.occupation, control: block.control});
    } else {
      let ent = this._entity.createNew(block.centerX, block.centerY, 0, 0);
      //ent.initSprite(scene, 'rudrabhoj_occupy1');
      ent.initSprite(scene, this._getOccupy(block.occupation, personList));
      ent.startX = 0.5;
      ent.startY = 0.5;
      this._storage.push({data: ent, a: block.a, b: block.b, id: block.occupation, occupation: block.occupation, control: block.control});
    }
  }

  filterGaps(data) {
    let arr = [];

    for (let c = 0; c < data.length; c++) {
      let sndX = false;
      let elm = data[c];

      //console.log(elm);

      for (let d = 0; d < this._storage.length; d++) {
        let elm2 = this._storage[d];
        if (elm._a == elm2.a && elm._b == elm2.b) sndX = true;
        //console.log("elm.a(%s) elm2.a(%s)", elm.a, elm2.a);
      }

      if (!sndX) arr.push(elm);
    }

    return arr;
  }

  _addListeners() {
    this._messageCenter.addListner('death', this._remove, this);
  }

  _remove(data) {
    let id = data.id;
    let arr = this._storage;
    let c = arr.length;

    while (c--) {
      if (arr[c].id == id) {
        arr[c].data.destroy();
        arr.splice(c, 1);
      }
    }
  }

  _getOccupy(id, list) {
    let person = this._getPerson(id, list);
    if (person != null ) {
      return person.label + "_occupy1";
    } else {
      console.warn('no player found with id: %s', id);
      return "rudrabhoj_occupy1";
    }
  }

  _getControl(id, list) {
    let person = this._getPerson(id, list);
    if (person != null ) {
      return person.label + "_control";
    } else {
      console.warn('no player found with id: %s', id);
      return "rudrabhoj_control";
    }
  }

  _getPerson(id, list) {
    for (let c = 0; c < list.length; c++) {
      let person = list[c];
      if (person.id == id) return person;
    }

    return null;
  }

  _allocateData() {

  }
}

module.exports = Color;
