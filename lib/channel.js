import Connection from './connection.js'

export default class Channel extends Connection {
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

    async *dequeue(options = { noAck: true }) {
        while(true) {
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
