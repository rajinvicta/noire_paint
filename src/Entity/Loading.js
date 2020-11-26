class Loading {
  constructor(entity) {
    this._entity = entity;
  }

  init(scene) {
    this._background = this._entity.createNew(0, 0);
    this._background.initFreeSprite(scene, 'loading_screen');
    this._background.startX = 0;
    this._background.startY = 0;

    this._title = this._entity.createNew(window.innerWidth / 2, 100);
    this._title.sheetName = 'init';
    this._title.initSprite(scene, 'game_title');
    this._title.startX = 0.5;
    this._title.startY = 0.5;

    this._empty = this._entity.createNew(window.innerWidth / 2, window.innerHeight - 150);
    this._empty.sheetName = 'init';
    this._empty.initSprite(scene, 'loading_empty');
    this._empty.startX = 0.5;
    this._empty.startY = 0.5;


    this._fill = this._entity.createNew(window.innerWidth / 2, window.innerHeight - 150);
    this._fill.sheetName = 'init';
    this._fill.initSprite(scene, 'loading_fill');
    this._fill.startX = 0.5;
    this._fill.startY = 0.5;
  }
}

module.exports = Loading;
