const mqtt = require('mqtt');
const SensorModel = require('../models/SensorModel');
const { getFormattedTime } = require('../utils/timeFormatter');

const client = mqtt.connect("mqtt://172.20.10.4");
// const client = mqtt.connect("mqtt://192.168.110.73");
const MQTT_TOPIC = "iot_QuangHoa";
const MQTT_REQUEST = "iot_QuangHoa_request";
const MQTT_UPDATE = "iot_QuangHoa_update";

const mqttService = {
  init: () => {
    client.on('connect', () => {
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) console.error('Failed to subscribe to topic:', err);
      });
    });

    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const data = JSON.parse(message);
          data.date = getFormattedTime();
          SensorModel.insertSensorData(data, (err) => {
            if (err) console.error('Failed to insert data:', err);
          });
        } catch (error) {
          console.error('Failed to process MQTT message:', error);
        }
      }
    });
  },

  publishDeviceAction: (device, action) => {
    return new Promise((resolve, reject) => {
      client.subscribe(MQTT_UPDATE, (err) => {
        if (err) return reject(err);

        client.publish(MQTT_REQUEST, JSON.stringify({ device, action }), (err) => {
          if (err) return reject(err);

          const timeout = setTimeout(() => {
            client.unsubscribe(MQTT_UPDATE);
            return reject(new Error("Timeout waiting for MQTT response"));
          }, 10000);

          const handleMessage = (topic, message) => {
            if (topic === MQTT_UPDATE) {
              clearTimeout(timeout);
              client.unsubscribe(MQTT_UPDATE);
              try {
                const data = JSON.parse(message);
                if (data.device === device && data.action === action) {
                  resolve({ success: true });
                }
              } catch (error) {
                reject(error);
              }
            }
          };

          client.on('message', handleMessage);
        });
      });
    });
  }
};

module.exports = mqttService;
