class MessageCenter {
  constructor() {
    this._messages = [];

    this.createMessage('death');
  }

  createMessage(msg) {
    this._messages.push(this._createMsg(msg));
  }

  addListner(msg, foo, context) {
    let message = this._getMsg(msg);

    if (message != null) {
      message.fooList.push(this._createFoo(foo, context));
    } else {
      console.warn("Did not find message with label: '%s'", msg);
    }
  }

  removeListner(msg, foo, context) {
    let message = this._getMsg(msg);

    if (message != null) {
      for (let c = 0; c < message.fooList.length; c++) {
        let cFoo = message.fooList[c].foo;
        if (cFoo == foo) message.fooList[c].foo = () => {};
      }
    } else {
      console.warn("Did not find message with label: '%s'", msg);
    }
  }

  emit(msg, data) {
    let message = this._getMsg(msg);

    if (message != null) {
      for (let c = 0; c < message.fooList.length; c++) {
        let cFoo = message.fooList[c].foo;
        let cContext = message.fooList[c].context;
        let g = cFoo.bind(cContext);
        g(data);
      }
    } else {
      console.warn("Did not find message with label: '%s'", msg);
    }
  }

  _getMsg(msg) {
    for (let c = 0; c < this._messages.length; c++) {
      let cMsg = this._messages[c].messsage;

      if (msg == cMsg) return this._messages[c];
    }

    return null;
  }

  _createFoo(foo, context) {
    return {foo: foo, context: context};
  }

  _createMsg(msg) {
    return {messsage: msg, fooList: []}
  }
}

module.exports = MessageCenter;
