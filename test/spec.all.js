var should = require('should')
  , redisPubSub = require('../index')(/*local*/)
  , PubSub

describe('Redis Pub/Sub', function () {

  it('should create an instance', function (done) {

    PubSub = (new redisPubSub()).Pub().Sub()

    if (PubSub instanceof redisPubSub)
      done()
  })

  it('should publish and recieve standard messages', function (done) {

    var channelName = 'spec.test'
      , messageObject = { key: 'test message' }

    var sub = PubSub.on({}, {}, function (data) {
      data.should.be.a('object')
      data.key.should.eql('test message')

      console.log(PubSub.queue)
      sub() // unsubscribe
      console.log(PubSub.queue)

      done()
    })

    PubSub.emit(channelName, messageObject)

  })

  it('should be able to use queries to filter messages', function (done) {

    var channelName = 'spec.test'
      , channelPattern = 'spec.*'
      , messageObject = [
            { key: 'test message' }
          , { age: 10, key: 'other message' }
          , { age: 21, key: 'none'}
        ]
    PubSub.on({ $has: ['key', 'age'], age: {$gt: 18}}, {}, function (data) {
      // channel.should.eql(channelName)
      // pattern.should.eql(channelPattern)
      // message.should.be.a('object')
      // message.key.should.eql('test message')

      // PubSub.off(channelPattern)

      // PubSub.cleanUp()
      console.log(data)
       done()
    })
      messageObject.forEach(function (message) {
        PubSub.emit(channelName, message)
      })

  })
})
