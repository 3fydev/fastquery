const clickhouseFormat = require('./clickhouseFormat')
const handleQueries = require('./handleQueries')

module.exports = {
  clickhouseFormat,
  ...handleQueries,
}
