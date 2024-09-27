const db = require("../config/db");

const ActionHistoryModel = {
  getActionHistory: (callback) => {
    const sql = "SELECT * FROM actionhistory ORDER BY ID DESC";
    db.query(sql, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  insertActionHistory: (data, callback) => {
    const sql = "INSERT INTO actionhistory (device, action, date) VALUES (?)";
    const values = [data.device, data.action, data.date];
    db.query(sql, [values], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  searchActionHistory: (filters, callback) => {
    const { deviceFilter, dateFilter, searchTerm, limit, offset } = filters;

    let query = "SELECT * FROM actionhistory";
    let countQuery = "SELECT COUNT(*) AS total FROM actionhistory";
    let conditions = [];

    // Xây dựng điều kiện tìm kiếm
    if (searchTerm && searchTerm !== "undefined") {
      if (deviceFilter) {
        conditions.push(`device = '${deviceFilter}'`);
        conditions.push(`action = '${searchTerm}'`);
      } else {
        conditions.push(`(device LIKE '%${searchTerm}%' OR action LIKE '%${searchTerm}%')`);
      }
    } else if (!searchTerm && deviceFilter) {
      conditions.push(`device = '${deviceFilter}'`);
    }

    // Lọc theo ngày
    if (dateFilter) {
      conditions.push(`Date >= '${dateFilter} 00:00:00' AND Date <= '${dateFilter} 23:59:59'`);
    }

    // Thêm điều kiện vào câu truy vấn
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    // Phân trang và sắp xếp
    query += " ORDER BY ID DESC LIMIT ? OFFSET ?";

    // Thực hiện truy vấn đếm số hàng
    db.query(countQuery, (err, countResult) => {
      if (err) return callback(err, null);

      const totalRows = countResult[0].total;

      // Truy vấn lịch sử hành động
      db.query(query, [limit, offset], (err, result) => {
        if (err) return callback(err, null);

        const data = result.map(row => {
          const dateObj = new Date(row.Date + "Z");
          const formattedDate = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(2, "0")} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(dateObj.getUTCMinutes()).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;
          
          return {
            id: row.ID,
            device: row.Device,
            action: row.Action,
            date: formattedDate
          };
        });
        callback(null, { records: data, total: totalRows });
      });
    });
  },
};

module.exports = ActionHistoryModel;