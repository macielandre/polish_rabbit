# Polish Rabbit
## Description
Simple package to handle with rabbitmq connection and channels with [amqplib](https://www.npmjs.com/package/amqplib) abstraction.

## Features

- [x] Connect to host
- [x] Close connection
- [x] Create channel
- [x] Send messages to queues
- [x] Consume messages from queues
- [x] Delete queues
- [x] Purge queues

> Consuming messages

Client.dequeue(options)

```js
import Channel from './lib/channel.js'

const cli = new Channel({ uri: 'amqp://guest:guest@localhost:5672', queue: 'your_queue' })

async function get() {
    await cli.createChannel()

    for await (const message of await cli.dequeue()) {
        console.log(message)
    }
}

get()
```

> Publishing messages:

```js
import Channel from './lib/channel.js'

const cli = new Channel({ uri: 'amqp://guest:guest@localhost:5672', queue: 'your_queue' })

async function send() {
    await cli.createChannel()

    cli.enqueue('your_string_message')
}

send()
```
