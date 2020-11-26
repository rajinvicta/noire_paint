class Socket {
  constructor(externs) {
    this._externs = externs;
    this._ws = null;
    this._counter = 0;

    this._onConnection = () => {

    }
  }

  start(port, onConn, onMsg, onClose, context) {
    this._ws = new this._externs.ws.Server({ port: port });
    this._ws.on('connection', ws => {

      let g = onConn.bind(context);
      let h = onMsg.bind(context);
      let j = onClose.bind(context);

      ws.gzpId = this._counter;
      this._counter++;


      g(ws);

      ws.on('message', message => {
        h(JSON.parse(message));
      });

      ws.on('close', message => {
        j(ws);
      })

    })
  }

  sendUpdate(socket, data, type) {
    data.type = type;
    socket.send(JSON.stringify(data));
  }
}

module.exports = Socket;
