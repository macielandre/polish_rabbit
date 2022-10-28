const Connection = require('./connection')

class ConfirmChannel extends Connection {
    constructor() {
        this.confirmChannel = null
    }
}

module.exports = ConfirmChannel