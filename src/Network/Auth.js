class Auth {
  constructor() {

  }

  getRandomToken() {
    let validItems = this._getValidItems();
    let alpha = this._getMixed(validItems, 12);
    let num = this._rndStr(10000, 99999);

    let token = alpha + num;

    return token;    
  }

  _getMixed(arr, size) {
    let key = "";

    for (let c = 0; c < size; c++) {
      let r = this._rndNum(0, (arr.length - 1));
      key = key + arr[r];
    }

    return key;
  }

  _getValidItems() {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
            'u', 'v', 'w', 'x', 'y', 'z'];
  }

  _rndStr(min, max) {
    let r = this._rndNum(min, max);

    return r.toString();
  }

  _rndNum(min, max) {
    return (Math.random() * (max - min + 1) ) << 0;
  }
}

module.exports = Auth;
