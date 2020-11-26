class LoadScene {
  constructor(scene, messageCenter, externs, loading) {
    this._scene = scene;
    this._messageCenter = messageCenter;
    this._externs = externs;
    this._loading = loading;

    this._loader = null;

    this._data = null;

    this._initScene();
  }

  get data() {
    return this._data;
  }

  _preload() {

  }

  _create() {
    let phaser = this._getPhaser();
    this._loader = new phaser.Loader.LoaderPlugin(this._data);

    this._loadAtlas('init', 'assets/img/init.png', 'assets/img/init.json');
    this._loadImage('loading_screen', 'assets/img/background/loading_screen.jpg');
    this._loadImage('menu_bg', 'assets/img/background/menu_bg.jpg');
    this._loader.start();
    this._loader.on('complete', this._drawLoader, this);
  }

  _drawLoader() {
    this._loading.init(this._data);
  }

  _downloadGame() {
    console.log("LoadScene created!");

    let phaser = this._getPhaser();
    this._loader = new phaser.Loader.LoaderPlugin(this._data);

    this._loadAtlas('mainsheet', 'assets/img/mainsheet.png', 'assets/img/mainsheet.json');
    this._loader.start();
    this._loader.on('complete', this._loadMain, this);
  }

  _update() {
    //this._messageCenter.emit('test', 'print again and again');
  }

  _shutdown() {
    console.log("LoadScene dead");
  }

  _loadMain() {
    this._shutdown();
    this._messageCenter.emit('start_scene', 'MainScene');
  }


  _initScene() {
    this._data = this._createScene('LoadScene', this._preload, this._create, this._update);
  }

  _createScene(key, preload, create, update) {
    return this._scene.createScene(key, preload, create, update, this);
  }

  _getPhaser() {
    return this._externs.phaser;
  }

  _loadAtlas(key, pathPng, pathJson) {
    this._loader.atlas(key, pathPng, pathJson);
  }

  _loadImage(key, path) {
    this._loader.image(key, path);
  }
}

module.exports = LoadScene;
