class Wall {
  constructor(entity) {
    this._entity = entity;
  }

  init(scene) {
    let left = this._entity.createNew(0, 2025, 0, 0);
    let right = this._entity.createNew(3975, 2025, 0, 0);
    let up = this._entity.createNew(2025, 0, 0, 0);
    let down = this._entity.createNew(2025, 3975, 0, 0);

    console.log(left.init);

    left.initSprite(scene, 'yash');
    up.initSprite(scene, 'yash');
    right.initSprite(scene, 'yash');
    down.initSprite(scene, 'yash');

    left.scaleY = 80;
    up.scaleX = 80;

    right.scaleY = 80;
    down.scaleX = 80;
  }
}

module.exports = Wall;
