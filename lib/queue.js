class Queue {
  static get(queueUriName) {
    const queues = process.env.QUEUES

    const queuesUriNames = queues.split(" ")
    const queueUri = queuesUriNames.find((el) => el.includes(queueUriName))

    if (!queueUri) {
      throw new Error("Queue uri not defined on environment variables")
    }

    // eslint-disable-next-line no-unused-vars
    const [_, connectionUrl, optionsString] = queueUri.split(/[=?]/g)
    const optionsSplitted = optionsString.split(",")
    const options = {}

    for (const optionString of optionsSplitted) {
      const [key, value] = optionString.split(/[=:]/g)

      options[key] = Number(value)
    }

    const [uri, vhost, queue] = connectionUrl.split(/(?<!\/)\/(?!\/)/g)

    return {
      options,
      uri,
      vhost,
      queue,
    }
  }
}

module.exports = Queue
