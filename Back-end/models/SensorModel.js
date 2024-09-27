const db = require("../config/db");

const SensorModel = {
  getRecentSensorData: (limit, callback) => {
    const sql = `SELECT Fan, Light, AC, Temperature, Humidity, Lux FROM datasensor ORDER BY id DESC LIMIT ?`;
    db.query(sql, [limit], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  insertSensorData: (data, callback) => {
    const sql = "INSERT INTO datasensor (Temperature, Humidity, Lux, Date, Fan, Light, AC) VALUES (?)";
    const values = [data.temperature, data.humidity, data.lux, data.date, data.fan, data.light, data.ac];
    db.query(sql, [values], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  searchSensorData: (filters, callback) => {
    const { parameterFilter, dateFilter, searchTerm, limit, offset } = filters;
    
    let query = "SELECT * FROM datasensor";
    let countQuery = "SELECT COUNT(*) AS total FROM datasensor";
    let conditions = [];

    // Xây dựng điều kiện tìm kiếm
    if (searchTerm && searchTerm !== "undefined") {
      if (parameterFilter === "Temperature") {
        conditions.push(`ROUND(Temperature, 1) = ${searchTerm}`);
      } else if (parameterFilter === "Humidity") {
        conditions.push(`Humidity = ${searchTerm}`);
      } else if (parameterFilter === "Lux") {
        conditions.push(`ROUND(Lux, 1) = ${searchTerm}`);
      } else {
        conditions.push(`(ROUND(Temperature, 1) = ${searchTerm} OR Humidity = ${searchTerm} OR ROUND(Lux, 1) = ${searchTerm})`);
      }
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

      // Truy vấn dữ liệu cảm biến
      db.query(query, [limit, offset], (err, result) => {
        if (err) return callback(err, null);

        const data = result.map(row => {
          const dateObj = new Date(row.Date + "Z");
          const formattedDate = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(2, "0")} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(dateObj.getUTCMinutes()).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;
          
          return {
            id: row.ID,
            temperature: row.Temperature + "°C",
            humidity: row.Humidity + "%",
            lux: row.Lux + " lux",
            date: formattedDate
          };
        });
        callback(null, { records: data, total: totalRows });
      });
    });
  },
};

module.exports = SensorModel;