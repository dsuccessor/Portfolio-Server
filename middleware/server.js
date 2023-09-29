const axios = require("axios");

// export default axios.create({
//   baseURL: "https://schoolportal.vercel.app",
// });
const server = axios.create({
  baseURL: "https://schoolportal.vercel.app",
});

module.exports = server;
