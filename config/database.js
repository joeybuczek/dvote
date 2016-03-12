// env vars
if (!process.env.MONGO_URL) { require('./env'); }

module.exports = {
  'url' : process.env.MONGO_URL
};