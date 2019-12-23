function getParam(parent, data) {
  if (!data) {
    return null;
  }

  return Object.keys(data)
    .map(function(k) {
      if (typeof data[k] === "object") {
        return getParam(k, data[k]);
      }
      return (
        (parent !== null ? `${parent}.` : "") +
        encodeURIComponent(k) +
        "=" +
        encodeURIComponent(data[k])
      );
    })
    .join("&");
}

function jsonToQueryNoQuestionMark(data) {
  return getParam(null, data);
}

function jsonToQuery(data) {
  return getParam(null, data).replace("&", "?");
}

module.exports = {
  jsonToQueryNoQuestionMark,
  jsonToQuery
};
