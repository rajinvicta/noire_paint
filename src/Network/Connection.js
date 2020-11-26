class Connection {
  constructor(config) {
    this._config = config;
    this._connection = null;
  }

  start(onMsg, context) {
    let url = this._getUrl();
    let g = onMsg.bind(context);

    this._connection = new WebSocket(url);

    this._connection.onmessage = e => {
      g(JSON.parse(e.data));
    }

  }

  send(data) {
    this._connection.send(JSON.stringify(data));
  }

  _getUrl() {
    return this._config.url;
  }
}

module.exports = Connection;
