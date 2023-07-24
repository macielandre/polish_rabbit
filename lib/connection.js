const amqp = require("amqplib")
const logger = require("../log4js.js").getLogger("[RABBITMQ] [CONNECTION]")

class Connection {
  constructor({ vhost, user, password, host, port, uri = null, options = {} }) {
    if (uri) {
      this.uri = `${uri}/${vhost}`
    } else {
      this.connection = null
      this.channel = null
      this.uri = `amqp://${user}:${password}@${host}:${port}/${vhost}`
    }

    this.options = options
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.uri, this.options)
    } catch (err) {
      logger.error(err)

      await new Promise((r) => setTimeout(r, 1000))

      console.log(1)
      await this.connect()
    }

    logger.debug("Connection succeded")
  }

  async close() {
    await this.connection.close()
  }
}

module.exports = Connection
