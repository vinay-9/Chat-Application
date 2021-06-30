const moment = require('moment');
//yeh console pe show karne ke kaam aa hai
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
module.exports = formatMessage;