const log4js = require("log4js")

class Log4js {
  static getLogger(context) {
    const logger = log4js.getLogger(context)

    logger.level = process.env.LOG_LEVEL || "debug"

    return logger
  }
}

module.exports = Log4js
