const amqp = require('amqplib')

class Connection {
    constructor({ queue, user, password, host, port, uri = null, options = {} }) {
        this.connection = null
        this.channel = null
        this.queue = queue
        this.uri = uri ? uri : `amqp://${user}:${password}@${host}:${port}`
        this.options = options
    }

    async connect() {
        this.connection = await amqp.connect(this.uri, this.options)

        this.setConnectionEvents()

        console.log('[Rabbitmq] Connection succeded')
    }

    setConnectionEvents() {
        this.connection.on('close', close => {
            console.log('[Rabbitmq] Connection closed')
        })
        this.connection.on('error', error => {
            console.log('[Rabbitmq] Connection error')
        })
        this.connection.on('blocked', blocked => {
            console.log('[Rabbitmq] Connection blocked')
        })
        this.connection.on('unblocked', unblocked => {
            console.log('[Rabbitmq] Connection unblocked')
        })
    }

    async close() {
        await this.connection.close()
    }
}

module.exports = Connection