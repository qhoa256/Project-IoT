#include <DHT.h>
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define MQTT_SERVER "172.20.10.4"
// #define MQTT_SERVER "192.168.110.73"
#define MQTT_PORT 1883
#define MQTT_TOPIC "iot_QuangHoa"
#define MQTT_REQUEST "iot_QuangHoa_request"
#define MQTT_UPDATE "iot_QuangHoa_update"

const char *ssid = "QuangHoa";
const char *password = "quanghoa2506";

// const char *ssid = "35C_TranPhu";
// const char *password = "35tranphuwifi";

const int fan = 12;
const int ac = 27;
const int light = 25;
const int photoPin = 34;

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi()
{
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected, IP address: " + WiFi.localIP().toString());
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("]");

  DynamicJsonDocument doc(256);
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error)
  {
    Serial.println(F("Failed to parse JSON"));
    return;
  }

  const char *device = doc["device"];
  const char *action = doc["action"];
  int pin = strcmp(device, "fan") == 0 ? fan : strcmp(device, "light") == 0 ? light
                                                                            : ac;

  if (strcmp(action, "on") == 0)
    digitalWrite(pin, HIGH);
  else if (strcmp(action, "off") == 0)
    digitalWrite(pin, LOW);

  doc.clear();
  doc["device"] = device;
  doc["action"] = action;
  char buffer[256];
  serializeJson(doc, buffer);
  client.publish(MQTT_UPDATE, buffer);
  Serial.println("State updated: " + String(buffer));
}

void setup()
{
  Serial.begin(115200);
  dht.begin();

  pinMode(fan, OUTPUT);
  pinMode(light, OUTPUT);
  pinMode(ac, OUTPUT);

  digitalWrite(fan, LOW);
  digitalWrite(light, LOW);
  digitalWrite(ac, LOW);

  setup_wifi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
  client.subscribe(MQTT_REQUEST);
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ArduinoClient"))
    {
      Serial.println("connected");
      client.subscribe(MQTT_REQUEST);
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop()
{
  if (!client.connected())
    reconnect();
  client.loop();

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float lux = ceil(analogRead(photoPin) / 4.0) + 1;

  // if (isnan(humidity) || isnan(temperature)) {
  //   Serial.println(F("Failed to read from DHT sensor!"));
  //   return;
  // }

  // Serial.println(humidity);

  // Prepare JSON payload
  DynamicJsonDocument doc(256);
  doc["humidity"] = humidity;
  doc["temperature"] = temperature;
  doc["lux"] = lux;
  doc["fan"] = digitalRead(fan);
  doc["light"] = digitalRead(light);
  doc["ac"] = digitalRead(ac);

  char buffer[256];
  serializeJson(doc, buffer);
  client.publish(MQTT_TOPIC, buffer);
  Serial.println("Published: " + String(buffer));

  delay(2000);
}