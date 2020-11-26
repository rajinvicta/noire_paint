class Kernel {
  constructor(world, messageCenter, mainScene, loadScene) {
    this._world = world;
    this._messageCenter = messageCenter;

    this._mainScene = mainScene;
    this._loadScene = loadScene;

    this._game = null;

    this._addMessages();
    this._initKernel();
    this._addListeners();
  }

  _printData(d) {
    console.log(d);
  }

  _addMessages() {
    this._addMessage('start_scene');
    this._addMessage('test');
  }

  _addListeners() {
    this._messageCenter.addListner('test', this._printData, this);

    setTimeout(() => {
      console.log("test message off!");
      this._messageCenter.removeListner('test', this._printData, this);
    }, 5000);


    this._messageCenter.addListner('start_scene', this._startScene, this);
  }

  _initKernel() {
    this._world.start();
    this._world.addScene('LoadScene', this._loadScene.data);
    this._world.addScene('MainScene', this._mainScene.data);
    this._world.startScene('LoadScene');

    console.log("kernel initialized");
  }

  _startScene(scnName) {
    this._world.startScene(scnName);
  }

  _getScene(scn) {
    return scn.data;
  }

  _addMessage(msg) {
    this._messageCenter.createMessage(msg);
  }
}

module.exports = Kernel;
