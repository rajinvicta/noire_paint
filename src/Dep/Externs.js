let Phaser = null;
let Hammer = null;
let Hapi = null;
const WebSocket = require('ws');

if (typeof window == 'undefined') {
  Hapi = require('@hapi/hapi');
} else {
  Phaser = require("phaser");
  Hammer = require('hammerjs');
}

class Externs {
  constructor() {
    this._phaser = Phaser;
    this._hammer = Hammer;
    this._hapi = Hapi;
    this._ws = WebSocket;
  }

  get phaser() {
    return this._phaser;
  }

  get hammer() {
    return this._hammer;
  }

  get hapi() {
    return this._hapi;
  }

  get ws() {
    return this._ws;
  }
}

module.exports = Externs;
