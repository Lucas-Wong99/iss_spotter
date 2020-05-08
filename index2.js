// const { fetchMyIP } = require('./iss_promised');
// const { fetchCoordsByIP } = require('./iss_promised');
// const { fetchISSFlyOverTimes } = require('./iss_promised');
const { nextISSTimesForMyLocation } = require('./iss_promised');
const { convertPassTimes } = require('./index.js');

// fetchMyIP()
// .then((response) => {
//   return fetchCoordsByIP(response);
// })
// .then((coords) => {
//   return fetchISSFlyOverTimes(coords);
// })
// .then((times) => {
//   console.log(JSON.parse(times));
// })
nextISSTimesForMyLocation()
.then((response) => {
  convertPassTimes(response);
})
.catch((error) => {
  console.log("It didn't work: ", error.message);
});


