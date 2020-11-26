class PersonList {
  constructor() {
    this._pList = [];
  }

  get pList() {
    return this._pList;
  }

  addPerson(person, id, label) {
    let o = {
      data: person,
      id: id,
      label: label
    }

    this._pList.push(o);
  }
}

module.exports = PersonList;
