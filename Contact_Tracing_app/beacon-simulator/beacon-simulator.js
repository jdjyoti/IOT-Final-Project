var bleno = require('bleno');

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);
  if (bleno.state === 'poweredOn') {
    bleno.startAdvertisingIBeacon('4577de14-89d3-11ec-a8a3-0242ac120002', 0, 0,0);// Hard-coded value beacuse of limitation of my laptop bluetooth
  } else {
    bleno.stopAdvertising();
  }
}); 

bleno.on('advertisingStart', function (error) {
  console.log('Simulating started');
});


bleno.on('advertisingStop', function () {
  console.log('Simulating stopped');
});