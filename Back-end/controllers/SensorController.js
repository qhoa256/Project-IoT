const SensorModel = require("../models/SensorModel");

let sensorData = [];

const SensorController = {
  getRecentSensorData: (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    SensorModel.getRecentSensorData(limit, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching data from database" });
      }
      return res.json(data);
    });
  },

  insertSensorData: (req, res) => {
    const sensorData = req.body;
    SensorModel.insertSensorData(sensorData, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: "Error inserting sensor data" });
      }
      return res.json({ success: true });
    });
  },

  searchSensorData: (req, res) => {
    const {
      parameterFilter,
      dateFilter,
      searchTerm,
      pageSize = 10,
      currentPage = 1,
    } = req.query;

    const limit = parseInt(pageSize);
    const offset = (parseInt(currentPage) - 1) * limit;

    const filters = {
      parameterFilter,
      dateFilter,
      searchTerm,
      limit,
      offset,
    };

    SensorModel.searchSensorData(filters, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error searching sensor data" });
      }
      sensorData = result.records;
      return res.json(result);
    });
  },

  sortSensorData: (req, res) => {
    const { column, newSortOrder } = req.query;

    if (!column || !newSortOrder) {
      return res
        .status(400)
        .json({ error: "Missing required sorting parameters" });
    }

    if (!sensorData.length) {
      return res.status(400).json({ error: "No data to sort" });
    }

    // Sắp xếp dữ liệu trên bộ nhớ
    const sortedData = sensorData.sort((a, b) => {
      if (newSortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    res.json(sortedData);
  },
};

module.exports = SensorController;
