const inversify = require("inversify");
require("reflect-metadata");

class SmartDepend {
  constructor() {
    this._allocateResources();
  }

  get container() {
    return this._container;
  }

  addObject(depName, depObject, depSingle) {
    if(!this._depExist(depName)) {
      let newItm = this._createDep(depName, depObject, depSingle);
      this._addDepItem(newItm);
    } else {
      console.error("Object named '%s' already registered.", depName);
    }
  }

  decorate() {
    this._depUnits.forEach((depUnit) => {
      inversify.decorate(inversify.injectable(), this._depGetObject(depUnit));
    });
  }

  addDependency(baseItmString, depString) {
    let depItm = this._getItem(baseItmString);

    inversify.decorate(inversify.inject(depString), this._depGetObject(depItm), this._depGetIndex(depItm));
    this._depUpdateIndex(depItm);
  }

  bindAll() {
    this._depUnits.forEach((depItm) => {
      let singletonMode = depItm.single;

      if(singletonMode) {
        this._container.bind(this._depGetName(depItm)).to(this._depGetObject(depItm)).inSingletonScope();
      } else {
        this._container.bind(this._depGetName(depItm)).to(this._depGetObject(depItm));
      }
    });
  }

  _allocateResources() {
    this._depUnits = [];
    this._container = new inversify.Container();
  }

  _addDepItem(itm) {
    this._depUnits.push(itm);
  }

  _createDep(depName, depObject, depSingle) {
    let depItm = {
      name: depName,
      object: depObject,
      single: depSingle,
      index: 0
    }

    return depItm;
  }

  _depExist(depName) {
    if(this._getItem(depName) === null) {
      return false;
    } else {
      return true;
    }
  }

  _getItem(itmName) {
    let rtn = null;

    this._depUnits.forEach((depItm) => {
      if(depItm.name === itmName) rtn = depItm;
    });

    return rtn;
  }

  _depGetObject(depItm) {
    return depItm.object;
  }

  _depGetName(depItm) {
    return depItm.name;
  }

  _depGetIndex(depItm) {
    return depItm.index;
  }

  _depUpdateIndex(depItm) {
    depItm.index++;
  }
}


module.exports = SmartDepend;
