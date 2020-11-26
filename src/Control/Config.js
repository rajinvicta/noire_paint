class Config {
  constructor() {

  }

  get maxPlayerPerSession() {
    return 5;
  }

  get personX() {
    return 50;
  }

  get personY() {
    return 50;
  }

  get totalBlockX() {
    return 80;
  }

  get totalBlockY() {
    return 80;
  }

  get isServer() {
    if (typeof window === 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  get url() {
    return 'ws://localhost:5000';
  }

  createNew() {
    return new Config();
  }
}

module.exports = Config;
