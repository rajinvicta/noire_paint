class Entity {
  constructor(config) {
    this._config = config;

    this._x = 0;
    this._y = 0;
    this._startX = 0;
    this._startY = 0;
    this._scaleX = 0;
    this._scaleY = 0;

    this._surface = null;
    this._scene = null;
    this._sheetName = 'mainsheet';
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get startX() {
    return this._startX;
  }

  get startY() {
    return this._startY;
  }

  get scaleX() {
    return this._scaleX;
  }

  get scaleY() {
    return this._scaleY;
  }

  set x(xVal) {
    this._x = xVal;
    if(this._surface != null) this._updateSurface();
  }

  get sheetName() {
    return this._sheetName;
  }

  set y(yVal) {
    this._y = yVal;
    if(this._surface != null) this._updateSurface();
  }

  set startX(sxVal) {
    this._startX = sxVal;
    if (this._surface != null) this._surface.setOrigin(this._startX, this._startY);
  }

  set startY(syVal) {
    this._startY = syVal;
    if (this._surface != null) this._surface.setOrigin(this._startX, this._startY);
  }

  set scaleX(scX) {
    this._scaleX = scX;
    if (this._surface != null) this._surface.scaleX = this._scaleX;
  }

  set scaleY(scY) {
    this._scaleY = scY;
    if (this._surface != null) this._surface.scaleY = this._scaleY;
  }

  set sheetName(sName) {
    this._sheetName = sName;
  }

  initSprite(scene, sprName) {
    let isServer = this._isServer();

    if(!isServer) this._surface = scene.add.sprite(this._x, this._y, this._sheetName, sprName);
    if(!isServer) this._scene = scene;

    this._updateSurface();
  }

  initFreeSprite(scene, sprName) {
    let isServer = this._isServer();

    if(!isServer) this._surface = scene.add.sprite(this._x, this._y, sprName);
    if(!isServer) this._scene = scene;

    this._updateSurface();
  }

  createNew(x, y, startX, startY) {
    let o = new Entity(this._config);

    o.x = x;
    o.y = y;
    o.startX = startX;
    o.startY = startY;

    return o;
  }

  bringToTop() {
    let isServer = this._isServer();
    if(!isServer) this._scene.children.bringToTop(this._surface);
  }

  destroy() {
    let isServer = this._isServer();
    if(!isServer) this._surface.destroy();
  }

  _updateSurface() {
    let isServer = this._isServer();

    if(!isServer) this._surface.x = this._x;
    if(!isServer) this._surface.y = this._y;
  }

  _isServer() {
    return this._config.isServer;
  }
}

module.exports = Entity;
