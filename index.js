const { nextISSTimesForMyLocation } = require('./iss');

const convertPassTimes = function(array) {
  for (const item of array) {
    const time = new Date(0);
    time.setUTCMinutes(item.risetime);
    const duration = item.duration;
    console.log(`The ISS Spotter will be visible at ${time} for ${duration} seconds.`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  convertPassTimes(passTimes);
});