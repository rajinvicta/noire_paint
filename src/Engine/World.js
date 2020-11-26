class World {
  constructor(externs) {
    this._externs = externs;

    this._world = null;
  }

  start() {
    let phaser = this._getPhaser();
    const config = {
      // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
      type: Phaser.CANVAS,
      pixelArt: true,
      roundPixels: true,
      parent: 'content',
      width: window.innerWidth,
      height: window.innerHeight
    };

    this._world = new phaser.Game(config);

    console.log("world created");
  }

  addScene(key, scene) {
    this._world.scene.add(key, scene);
  }

  startScene(key) {
    this._world.scene.start(key);
  }


  _getPhaser() {
    return this._externs.phaser;
  }
}

module.exports = World;
