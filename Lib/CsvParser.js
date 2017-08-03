const moment = require('moment'),
  JSONPath = require('JSONPath');

const DATE_FORMAT = "YYYY-MM-DD",
  CSV_COLUMNS = ['$.friends', '$.handle', '$.id', '$.location.city', '$.location.coordinates', '$.location.country', '$.location.street.name', '$.location.street.number', '$.personal.age', '$.personal.birthday', '$.personal.gender', '$.personal.name.first', '$.personal.name.last', '$.web.avatar', '$.web.email', '$.web.facebook', '$.web.ip'];

class CsvParser {

  constructor() {
    this.counter = 0;
    this.totalNumberOfFriends = 0;
  }

  fromStringLine(line) {
    if (!this.isJsonProper(line)) {
      return;
    }
    let json = JSON.parse(line);
    this.parseDate(json);

    this.counter++;
    this.totalNumberOfFriends += this.getNumberOfFriends(json);
    return this.flattenObject(json);
  }

  parseDate(jsonRow) {
    let personBirthdate = moment(jsonRow.personal.birthday, DATE_FORMAT),
      age = moment().diff(personBirthdate, 'years');
    jsonRow.personal.age = age;
  }

  getNumberOfFriends(jsonRow) {
    return jsonRow.friends.length;
  }

  getAverageNumberOfFriends() {
    return this.totalNumberOfFriends / this.counter;
  }

  isJsonProper(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  flattenObject(obj) {
    let flatObj = {};

    CSV_COLUMNS.forEach((path) => {
      let columnName = path.substring(2);
      let found = JSONPath({}, path, obj);
      if (found.length) {
        flatObj[columnName] = found[0];
      }
    });
    return flatObj;
  }
}

module.exports = CsvParser;