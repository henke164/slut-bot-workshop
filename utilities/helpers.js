function randomInt(len = 1) {
  var stringadd = ``;

  if (len > 1) {
    var added = 1;
    do {
      added += 1;
      stringadd = stringadd + `0`
    } while (added < len);
  }

  var min = parseInt(`1${stringadd}`);
  var max = parseInt(`9${stringadd}`);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  randomInt
};
