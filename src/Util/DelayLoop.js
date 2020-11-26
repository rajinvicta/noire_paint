class DelayLoop {
  constructor() {
    this._fooList = [];
  }

  addFunction(foo, context) {
    this._fooList.push({foo: foo, context: context, g: foo.bind(context)});
  }

  start(delay=60) {

    // Turn this off when fooLit is cleared, don't start when it is empty
    if (this._fooList.length > 0) {
      setTimeout(() => {
        this._executeAll();
        this.start(delay);
      }, delay);
    }
  }

  _executeAll() {
    for (let c = 0; c < this._fooList.length; c++) {
      let g = this._fooList[c].g;
      g();
    }
  }

  clearAll() {
    this._fooList = [];
  }


}

module.exports = DelayLoop;
