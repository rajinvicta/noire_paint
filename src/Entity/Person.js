class Person {
  constructor(entity, movement, accuTime) {
    this._entity = entity;
    this._movement = movement;
    this._accuTime = accuTime;

    this._locked = false;
    this._minLock = 0; //ms

    this._pendingDeath = false;
    this._destroyed = false;
  }

  get x() {
    return this._entity.x;
  }

  get y() {
    return this._entity.y;
  }

  get pendingDeath() {
    return false;
    return this._pendingDeath;
  }

  get destroyed() {
    return this._destroyed;
  }

  set pendingDeath(pd) {
    this._pendingDeath = pd;
  }

  createNew() {
    let e = this._entity.createNew(0, 0, 0, 0);
    let m = this._movement.createNew();
    let a = this._accuTime.createNew();

    return new Person(e, m, a);
  }

  init(scene, picture, x, y) {
    if (this._destroyed) return;
    this._entity = this._entity.createNew(x, y, 0, 0);
    this._entity.initSprite(scene, picture);
    this._entity.startX = 0.5;
    this._entity.startY = 0.5;
  }

  export() {
    if (this._destroyed) return;
    return this._movement.export();
  }

  import(mvList) {
    if (this._destroyed) return;
    this._movement.import(mvList);
  }

  bringToTop() {
    if (this._destroyed) return;
    this._entity.bringToTop();
  }

  moveLeft() {
    if (this._destroyed) return;
    if (this._locked) return;
    let lockTime = this._movement.addMove(this._entity.x, this._entity.y, 'left', this._getTime());
    this._lock(lockTime);
  }

  moveRight() {
    if (this._destroyed) return;
    if (this._locked) return;
    let lockTime = this._movement.addMove(this._entity.x, this._entity.y, 'right', this._getTime());
    this._lock(lockTime);
  }

  moveUp() {
    if (this._destroyed) return;
    if (this._locked) return;
    let lockTime = this._movement.addMove(this._entity.x, this._entity.y, 'up', this._getTime());
    this._lock(lockTime);
  }

  moveDown() {
    if (this._destroyed) return;
    if (this._locked) return;
    let lockTime = this._movement.addMove(this._entity.x, this._entity.y, 'down', this._getTime());
    this._lock(lockTime);
  }

  update() {
    if (this._destroyed) return;

    let pos = this._movement.getPosition();

    if (pos != null && (pos.isDead === true && !this._pendingDeath)) {
      this._pendingDeath = true;
    }

    if (pos != null) {
      this._entity.x = this._round(pos.x);
      this._entity.y = this._round(pos.y);
    }
  }

  destroy() {
    this._destroyed = true;
    this._entity.destroy();
  }

  _round(n) {
    return n;
    return Math.round(n);
  }

  _lock(lockTime) {
    this._locked = true;

    setTimeout(() => {
      //console.log(this);
      this._locked = false;
    }, (this._minLock + lockTime));
  }

  _getTime() {
    return this._accuTime.getTime();
  }
}

module.exports = Person;
