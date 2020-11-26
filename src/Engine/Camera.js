class Camera {
  constructor() {

  }

  playerPos(scene, player) {
    let view = scene.cameras.main;
    player = player._person._entity._surface; //very hackish


    view.startFollow(player, true, 0.05, 0.05);
  }

  updateSize(scene) {
    let view = scene.cameras.main;
    let totalWidth = window.innerWidth;
    let totalHeight = window.innerHeight;

    view.setSize(totalWidth, totalHeight);
  }
}

module.exports = Camera;
