'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example'
  })

  fastify.post('/', async function (request, reply) {
    const test = this.mongo.client.db('test')
    const article = test.collection('article')
    await article.insertOne({ 'title': '안녕 세상아' })

    const result = await article.find({}).toArray();

    reply.send(result)
  })
}
