class SessionManager {
  constructor(config, session, blockWorld) {
    this._config = config;
    this._session = session;
    this._blockWorld = blockWorld;

    this._sessions = [];
  }

  getPersons(id) {
    let session = this._getSessionById(id);

    if (session != null) {
      return session.persons;
    } else {
      return null;
    }
  }

  getDraws(id) {
    let session = this._getSessionById(id);

    if (session != null) {
      return session.blockWorld.extractDraw();
    } else {
      return null;
    }
  }

  addPerson(person, label, id=0) {
    let session = this._getRoomySession();

    let playerId = session.addPlayer(person, label, id);

    return {sid: session.id, pid: playerId, session: session};
  }

  saveStates() {
    for (let c = 0; c < this._sessions.length; c++) {
      let session = this._sessions[c];
      session.saveState();
    }
  }

  update() {
    for (let c = 0; c < this._sessions.length; c++) {
      let session = this._sessions[c];
      let persons = session.persons;

      for (let d = 0; d < persons.length; d++) {
        let person = persons[d];
        let isServer = this._isServer();

        person.data.update();
        session.personPosition(person.data.x, person.data.y, person.id, person.data.pendingDeath);

        if (!isServer) person.data.bringToTop();
      }
    }
  }

/*
  recycle() {
    let arrSnd = [];

    for (let c = 0; c < this._sessions.length; c++) {
      let session = this._sessions[c];
      let recycled = session.recycle();

      arrSnd = arrSnd.concat(recycled);
    }

    return arrSnd;
  }
*/

  getPersonById(sid, pid) {
    let persons = this.getPersons(sid);

    for (let c = 0; c < persons.length; c++) {
      let person = persons[c];

      if (person.id == pid) return person.data;
    }

    return null;
  }

  _getSessionById(id) {
    for (let c = 0; c < this._sessions.length; c++) {
      let session = this._sessions[c];

      if (session.id == id) return session;
    }

    return null;
  }

  _getRoomySession() {
    for (let c = 0; c < this._sessions.length; c++) {
      let session = this._sessions[c];
      let sSize = this._getSessionSize(session);
      let lim = this._getMaxPlayers();

      if (sSize < lim) return session;
    }

    let s = this._createEmptySession();
    this._sessions.push(s);

    return s;
  }

  _createEmptySession() {
    let session = this._session.createNew();
    let b = this._blockWorld.createNew();

    session.blockWorld = b;

    return session;
  }

  _getMaxPlayers() {
    return this._config.maxPlayerPerSession;
  }

  _getSessionSize(session) {
    return session.totalPlayers;
  }

  _isServer() {
    return this._config.isServer;
  }


}

module.exports = SessionManager;
