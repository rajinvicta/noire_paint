class AccuTime {
  constructor() {

  }

  getTime() {
    return new Date().getTime();
  }

  createNew() {
    return new AccuTime();
  }
}

module.exports = AccuTime;
