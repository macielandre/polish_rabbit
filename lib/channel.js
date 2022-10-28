const Connection = require('./connection')

class Channel extends Connection {
    constructor({ queue, user, password, host, port, uri = null, options = {} }) {
        super({ queue, user, password, host, port, uri, options })

        this.queue = queue
    }

    async createChannel() {
        await this.connect()

        this.channel =  await this.connection.createChannel()

        await this.channel.assertQueue(this.queue, { durable: false })

        console.log('[Rabbitmq] Channel created')
    }

    setChannelEvents() {
        this.channel.on('close', close => {
            console.log('[Rabbitmq] Channel closed')
        })
        this.channel.on('error', error => {
            console.log('[Rabbitmq] Channel error')
        })
        this.channel.on('return', returns => {
            console.log('[Rabbitmq] Channel return')
        })
        this.channel.on('drain', drain => {
            console.log('[Rabbitmq] Channel drain')
        })
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
}

module.exports = Channel