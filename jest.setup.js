import { exec } from 'child_process'

beforeAll(() => {
    exec('pifpaf run rabbitmq', (err, output) => {
        if (err) {
            console.error("could not execute command: ", err)

            return
        }

        console.log("Output: \n", output)
    })
})

afterAll(() => {
    exec('pifpaf_stop', (err, output) => {
        if (err) {
            console.error("could not execute command: ", err)

            return
        }

        console.log("Output: \n", output)
    })
})