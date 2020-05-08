const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(response) {
  const ip = JSON.parse(response).ip;
  return request('https://ipvigilante.com/' + ip);
};

const fetchISSFlyOverTimes = function(coords) {
  const { latitude, longitude } = JSON.parse(coords).data;
  return request('http://api.open-notify.org/iss-pass.json?lat=' + latitude + '&lon=' + longitude);
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
  .then((response) => {
    return fetchCoordsByIP(response);
  })
  .then((coords) => {
    return  fetchISSFlyOverTimes(coords);
  })
  .then((times) => {
    const { response } = JSON.parse(times);
    return response;
  })
};

module.exports = {
  nextISSTimesForMyLocation 
}