# Polish Rabbit
## Description
Simple package to handle with rabbitmq connection and channels with [amqplib](https://www.npmjs.com/package/amqplib) abstraction.

## Features

> Connect to host
> Close connection
> Create channel
> Send messages to queues
> Consume messages from queues
> Delete queues
> Purge queues

## Runnig Rabbitmq instance

```docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management```

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
