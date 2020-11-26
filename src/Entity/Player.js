class Player {
  constructor(person, joystick) {
    this._person = person;
    this._joystick = joystick;

    this._moveControl = null;
    this._moveControl2 = null;
  }

  get x() {
    return this._person.x;
  }

  get y() {
    return this._person.y;
  }

  get pendingDeath() {
    return this._person.pendingDeath;
  }

  get destroyed() {
    return this._person.destroyed;
  }

  set pendingDeath(pd) {
    this._person.pendingDeath = pd;
  }

  init(scene, label, x, y) {
    this._person.init(scene, label, x, y);

    this._setupMoveControl(scene);
  }

  export() {
    return this._person.export();
  }

  import(mvList) {
    this._person.import(mvList);
  }

  bringToTop() {
    this._person.bringToTop();
  }

  update() {
    this._person.update();
  }

  destroy() {
    this._person.destroy();
  }

  _setupMoveControl(scene) {
    this._moveControl = this._joystick.createNew(scene);
    this._moveControl2 = this._joystick.createNew(scene);

    this._moveControl.addKey('LEFT',  this._leftPressed,  this);
    this._moveControl.addKey('RIGHT', this._rightPressed, this);
    this._moveControl.addKey('UP',    this._upPressed,    this);
    this._moveControl.addKey('DOWN',  this._downPressed,  this);

    this._moveControl2.addSwipe('swipeleft',  this._leftPressed,  this);
    this._moveControl2.addSwipe('swiperight', this._rightPressed, this);
    this._moveControl2.addSwipe('swipeup',    this._upPressed,    this);
    this._moveControl2.addSwipe('swipedown',  this._downPressed,  this);
  }

  _leftPressed() {
    this._person.moveLeft();
  }

  _rightPressed() {
    this._person.moveRight();
  }

  _upPressed() {
    this._person.moveUp();
  }

  _downPressed() {
    this._person.moveDown();
  }
}

module.exports = Player;
