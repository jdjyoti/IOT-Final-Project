var mosca = require('mosca');
const BeaconDetails = require('./model/beacon_Schema.model');
const addToDb, autoCalculateExitedBeacons = require('./services/beacon-service.js');
require("dotenv/config");

var settings = {
  port: 1883,
  http: { port: 8080, bundle: true, static: './' }
};

var server = new mosca.Server(settings, function () {
  console.log("Mosca server running");
});

autoCalculateExitedBeacons();

server.on("ready", function () {
  console.log("Mosca Server up");
});

//It is triggered when a  client is connected
server.on("clientConnected", function (client) {
  console.log("client connected", client.id);
});
var beaconSet = new Set();
//It is triggered when a message is received
server.on('published', function (packet, client) {
  try {
    beaconSet = JSON.parse(packet.payload);
    if (typeof beaconSet === 'object') {
      addToDb(packet.topic, beaconSet);
      checkLimit(packet.topic, beaconSet);
    }
  } catch (err) {
  }
});


//It is triggered when a client subscribes to a topic
server.on('subscribed', function (topic, client) {
  console.log("subscribed : ", topic);
});

//It is triggered when a client unsubscribes to a topic
server.on('unsubscribed', function (topic, client) {
  console.log("unsubscribed : ", topic);
})

//It is triggered when a client is disconnected
server.on("clientDisconnected", function (client) {
  console.log("clientDisconnected : ", client.id);
});


function checkLimit(topic, payload) {
  if (Array.from(payload).length > 10) {
    server.publish({
      topic: '/dashboard',
      payload: "Run for your life" + topic.toString()
    });
  }
  BeaconDetails.find({ is_active: true }, { _id: 0, beaconId: 1, matricula: 1, entry_time: 1, room_no :1 },
    function (err, docs) {
      let message = {
        topic: '/dashboard',
        payload: JSON.stringify({ beacons: docs })
      };
      server.publish(message);
      if (err) {
        console.log(err)
      }
    });
}

module.exports = { server };