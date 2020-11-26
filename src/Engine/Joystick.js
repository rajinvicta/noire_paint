class Joystick {
  constructor(externs) {
    this._externs = externs;

    this._scene = null;
    this._keys = [];
    this._swipes = [];

    this._externs = externs;
  }

  set scene(sc) {
    this._scene = sc;
  }

  createNew(scene) {
    let o = new Joystick(this._externs);
    o.scene = scene;

    return o;
  }

  addKey(key, f, context) {
    let g = f.bind(context);
    let keyObj = this._scene.input.keyboard.addKey(key);

    keyObj.on('down', (event) => {
      g(event);
    });

    this._keys.push(keyObj);
  }

  addSwipe(swipeDir, f, context) {
    let stage = document.getElementsByTagName('canvas')[0];
    let HammerJS = this._externs.hammer;
    let swipe     = new HammerJS.Swipe();

    let action = new HammerJS.Manager(stage);

    action.add(swipe);

    action.on(swipeDir, (ev) => {
    	let g = f.bind(context);
      g();
    });

    this._swipes.push(action);
  }

  removeKeys() {
    for (let c = 0; c < this._keys.length; c++) {
      let key = this._keys[c];
      key.destroy();
    }

    this._keys = [];
  }
}

module.exports = Joystick;
