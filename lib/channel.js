const Connection = require("./connection.js")
const path = require("path")
const Piscina = require("piscina")
const logger = require("../log4js.js").getLogger("[RABBITMQ] [CHANNEL]")

class Channel extends Connection {
  constructor({
    vhost,
    queue,
    user,
    password,
    host,
    port,
    uri = null,
    options = {},
  }) {
    super({ vhost, user, password, host, port, uri, options })

    this.channel = null
    this.queue = queue
  }

  async createChannel() {
    await this.connect()

    this.channel = await this.connection.createConfirmChannel()

    await this.channel.assertQueue(this.queue, { durable: false })

    this.setChannelEvents()
    this.setConnectionEvents()

    logger.debug("Channel created")
  }

  setChannelEvents() {
    this.channel.on("close", async () => {
      logger.debug("Channel closed")

      await this.createChannel()
    })

    this.channel.on("error", async () => {
      logger.debug("Channel closed")

      await this.createChannel()
    })

    this.channel.on("return", () => {
      logger.debug("Channel return")
    })

    this.channel.on("drain", () => {
      logger.debug("Channel drain")
    })
  }

  setConnectionEvents() {
    this.connection.on("close", async () => {
      logger.debug("Connection closed")

      await this.connect()
    })

    this.connection.on("error", async () => {
      logger.debug("Connection error")

      await this.connect()
    })

    this.connection.on("blocked", () => {
      logger.debug("Connection blocked")
    })

    this.connection.on("unblocked", () => {
      logger.debug("Connection unblocked")
    })
  }

  async enqueue(message, options = {}) {
    if (typeof message !== "string") {
      message = JSON.stringify(message)
    }

    const messageBuffer = Buffer.from(message)

    this.channel.sendToQueue(this.queue, messageBuffer, options, (err, ok) => {
      if (err !== null) {
        logger.error(err)
      } else {
        logger.debug("Message enqueued")
      }
    })
  }

  async *dequeue(options = { noAck: true }) {
    while (true) {
      const bufferMessage = await this.channel.get(this.queue, options)
      const message = bufferMessage?.content?.toString()

      if (message) yield message
    }
  }

  async deleteQueue() {
    await this.channel.deleteQueue(this.queue)
  }

  async purgeQueue() {
    await this.channel.purgeQueue(this.queue)
  }
}

module.exports = Channel
