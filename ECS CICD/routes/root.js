'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    console.log(process.env.MONGO_HOSTNAME)
    console.log(process.env.MONGO_USERNAME)
    return { root: true, host: process.env.MONGO_HOSTNAME, username: process.env.MONGO_USERNAME }
  })
}
