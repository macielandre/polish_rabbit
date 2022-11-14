const Connection = require('./connection.js')
const crypto = require('crypto')


class Channel extends Connection {
    constructor({ queue, user, password, host, port, uri = null, options = {} }) {
        super({ queue, user, password, host, port, uri, options })

        this.queue = queue
    }

    async createChannel() {
        await this.connect()

        this.channel =  await this.connection.createChannel()

        console.log('[Rabbitmq] Channel created')
    }

    async createQueue(queueName = this.queue, options = { durable: false }) {
        await this.channel.assertQueue(queueName, options)

        console.log('[Rabbitmq] Queue created')
    }

    async createExchange(exchangeName, exchangeType = 'headers', options) {
        await this.channel.assertExchange(exchangeName, exchangeType, options)

        console.log('[Rabbitmq] Exchange created')
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

    async *instantDequeue(options = {}) {
        options.noAck = true

        while(true) {
            const bufferMessage = await this.channel.get(this.queue, options)
            const message = bufferMessage?.content?.toString()

            if (message) yield message
        }
    }

    async retry() {
        const exchangeName = `${crypto.randomUUID()};exchange;${this.queue}`
        const queueName = `${crypto.randomUUID()};queue;${this.queue}`
        const queueOptions = { deadLetterExchange: exchangeName }
        
        await this.createQueue(queueName, queueOptions)
        await this.channel.bindQueue(queueName)
        await this.createExchange(exchangeName)
    }
}

module.exports = Channel