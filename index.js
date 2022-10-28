const amqp = require('amqplib')

class Rabbitmq {
    constructor({ queue, user, password, host, port, uri = null, options = {} }) {
        this.connection = null
        this.channel = null
        this.queue = queue
        this.uri = uri ? uri : `amqp://${user}:${password}@${host}:${port}`
        this.options = options
    }

    async connect() {
        this.connection = await amqp.connect(this.uri, this.options)
        this.channel =  await this.connection.createChannel()

        await this.channel.assertQueue(this.queue, { durable: false })

        console.log('[Rabbitmq] Connection succeded')
    }

    enqueue(message, options = {}) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message)
        }

        const messageBuffer = Buffer.from(message)

        this.channel.sendToQueue(this.queue, messageBuffer, options)

        console.log('[Rabbitmq] Message enqueued')
    }

    async dequeue(executableFn, options = {}) {
        await this.channel.consume(this.queue, async bufferMessage => {
            const message = bufferMessage.content.toString()

            executableFn(message)
        }, options)
    }

    async close() {
        await this.connection.close()
    }
}

module.exports = Rabbitmq