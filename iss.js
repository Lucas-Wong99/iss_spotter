/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let ip = JSON.parse(body).ip;
      callback(null, ip);
    }
  });
};

const fetchCoordsByIp = function(Ip, callback) {
  request('https://ipvigilante.com/' + Ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const data = JSON.parse(body);
      const obj = {
        latitude: data.data.latitude,
        longitude: data.data.longitude
      };
      callback(null, obj);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request('http://api.open-notify.org/iss-pass.json?lat=' + coords.latitude + '&lon=' + coords.longitude, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const data = JSON.parse(body);
      callback(null, data.response);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((ipError, ip) => {
    if (ipError) {
      callback(ipError, null);
      return;
    }
    fetchCoordsByIp(ip, (coordsError, coords) => {
      if (coordsError) {
        callback(coordsError, null);
        return;
      }
      fetchISSFlyOverTimes(coords, (flyTimesError, flyTimes) => {
        if (flyTimesError) {
          callback(flyTimesError, null);
          return;
        }
        callback(null, flyTimes);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIp,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};