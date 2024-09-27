const mqttService = require('../services/mqttService');
const ActionHistoryModel = require('../models/ActionHistoryModel');
const SensorModel = require('../models/SensorModel');
const { getFormattedTime } = require('../utils/timeFormatter');

const DeviceController = {
  controlDevice: async (req, res) => {
    const { device, action } = req.query;
    try {
      const result = await mqttService.publishDeviceAction(device, action);
      if (result.success) {
        const dev =
          device === "light" ? "Đèn" : device === "fan" ? "Quạt" : "Điều hoà";
        const act = action === "on" ? "Bật" : "Tắt";
        ActionHistoryModel.insertActionHistory({ device: dev, action: act, date: getFormattedTime() }, (err) => {
          if (err) {
            console.error("Error inserting action history into database:", err);
          }
        });
        return res.json({ device, action });
      } else {
        return res.status(500).json({ error: "Error controlling device" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = DeviceController;
