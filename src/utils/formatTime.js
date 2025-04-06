// import moment from "moment";
// export const formatTime = (seconds) => {
//     // Create a moment duration object from seconds
//     const duration = moment.duration(seconds, "seconds");
  
//     return moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
//   };


  // ----------------------------


// import moment from "moment";

// export const formatTime = (seconds) => {
//   // Create a moment duration object from seconds
//   const duration = moment.duration(seconds, "seconds");

//   // Extract days, hours, minutes, and seconds
//   const days = Math.floor(duration.asDays());
//   const formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");

//   // If there are days, format with days; otherwise, just return time
//   return days > 0 ? `${days}d ${formattedTime}` : formattedTime;
// };


// --------------------------------

import moment from "moment";

export const formatTime = (seconds) => {
  // Create a moment duration object from seconds
  const duration = moment.duration(seconds, "seconds");

  // Get total hours, including any additional days converted to hours
  let totalHours = Math.floor(duration.asHours()); // Get total hours (including days)

  // Format the time as HH:mm:ss
  const formattedTime = moment.utc(duration.asMilliseconds()).format("mm:ss");
  if(totalHours < 10){
    totalHours = "0"+totalHours;
  }
  // Return the time with total hours included
  return `${totalHours}:${formattedTime}`;
};
