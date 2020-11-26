class Scene {
  constructor(externs) {
    this._externs = externs;
  }

  createScene(key, preload, create, update, context) {
    let preload_context = preload.bind(context);
    let create_context = create.bind(context);
    let update_context = update.bind(context);

    let Scene = this._getScene();
    let phaser = this._getPhaser();

    class gs extends phaser.Scene {
      constructor() {
        super({
          key: key
        });
      }

      preload() {
        preload_context();
      }

      create() {
        create_context();
      }

      update() {
        update_context();
      }


    }

    return new gs();
  }

  _getScene() {
    let scene = this._getPhaser().Scene;

    return scene;
  }

  _getPhaser() {
    return this._externs.phaser;
  }
}

module.exports = Scene;
