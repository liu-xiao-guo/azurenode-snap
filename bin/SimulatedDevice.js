#!/usr/bin/env node

var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString = 'HostName={youriothostname};DeviceId=myFirstNodeDevice;SharedAccessKey={yourdevicekey}';

var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err.amqpError);
  } else {
    console.log('Client connected');

    // Create a message and send it to the IoT Hub every second
    setInterval(function(){
        var temp = 10 + (Math.random() * 4);
        var windSpeed = 10 + (Math.random() * 4);
//        var data = JSON.stringify({ deviceId: 'mydevice', windSpeed: windSpeed });
        var data = JSON.stringify({ deviceId: 'mydevice', temp: temp, windSpeed: windSpeed});
        var message = new Message(data);
        console.log("Sending message: " + message.getData());
        client.sendEvent(message, printResultFor('send'));

        // var data1 = JSON.stringify({ deviceId: 'mydevice', windSpeed: windSpeed });
        // var message1 = new Message(data1);
        // console.log("Sending message: " + message1.getData());
        // client.sendEvent(message1, printResultFor('send'));
    }, 5000);
  }
};

client.open(connectCallback);
