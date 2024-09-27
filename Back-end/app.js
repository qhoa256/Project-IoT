const express = require("express");
const cors = require("cors");
const swagger = require("swagger-ui-express");
const YAML = require("yamljs");
const sensorRoutes = require('./routes/sensorRoutes');
const historyRoutes = require('./routes/historyRoutes'); // Đảm bảo route này được thêm vào
const deviceRoutes = require('./routes/deviceRoutes');
const mqttService = require('./services/mqttService'); 

const app = express();
const PORT = 8081;

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/devices', deviceRoutes);

// Swagger Docs
const swaggerDocument = YAML.load("./apiswagger.yaml");
app.use("/apidocs", swagger.serve, swagger.setup(swaggerDocument));

// MQTT Service
mqttService.init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});