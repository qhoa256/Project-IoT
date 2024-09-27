const ActionHistoryModel = require('../models/ActionHistoryModel');

let historyData = []

const ActionHistoryController = {
  getActionHistory: (req, res) => {
    ActionHistoryModel.getActionHistory((err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching action history" });
      }
      return res.json(data);
    });
  },

  searchActionHistory: (req, res) => {
    const {
      deviceFilter,
      dateFilter,
      searchTerm,
      pageSize = 10,
      currentPage = 1,
    } = req.query;

    const limit = parseInt(pageSize);
    const offset = (parseInt(currentPage) - 1) * limit;

    const filters = {
      deviceFilter,
      dateFilter,
      searchTerm,
      limit,
      offset,
    };

    ActionHistoryModel.searchActionHistory(filters, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error searching action history" });
      }
      historyData = result.records;
      return res.json(result);
    });
  },

  sortActionHistory: (req, res) => {
    const { column, newSortOrder } = req.query;

    if (!column || !newSortOrder) {
      return res.status(400).json({ error: "Missing required sorting parameters" });
    }

    console.log(historyData);

    if (!historyData.length) {
      return res.status(400).json({ error: "No data to sort" });
    }

    // Sắp xếp dữ liệu trên bộ nhớ
    const sortedData = historyData.sort((a, b) => {
      if (newSortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    res.json(sortedData);
  }
};

module.exports = ActionHistoryController;