const BeaconScanner = require('node-beacon-scanner');
var mqtt = require('mqtt');
const scanner = new BeaconScanner();

var beanconSet = new Set();
//It is for collection of beacons which are nearby
scanner.onadvertisement = (ad) => {
		beanconSet.add(JSON.stringify(ad.iBeacon.uuid, null, '  '));
};

//Scanning begins 
scanner.startScan().then(() => {
    console.log('Started to scan.');
}).catch((error) => {
    console.error(error);
});

var settings = {
	port: 1883, //This is the mosca port number
	clientId: 'scanner1' 
};

topic = '/101' //Channel on which data is sent
var client = mqtt.connect('mqtt://localhost', settings);

client.on('connect', function () {
	console.log("Scanner started" + client.connected);
	client.subscribe(topic); //Client Subscribes to topic
	console.log(JSON.stringify(Array.from(beanconSet))); 
	setInterval(function() {
			client.publish(topic , JSON.stringify(Array.from(beanconSet)));
	}, 30000); // Dumps the data every after 30 secs
});

