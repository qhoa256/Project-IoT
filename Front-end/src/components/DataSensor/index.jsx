import "./styles.css";
import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  FaSort as Sort,
  FaSortAmountDown as SortDown,
  FaSortAmountUpAlt as SortUp,
} from "react-icons/fa";

const customStyles = {
  cells: {
    style: {
      fontSize: "1.6rem",
      fontWeight: 500,
    },
  },
  headCells: {
    style: {
      fontSize: "1.6rem",
      fontWeight: 700,
      backgroundColor: "#1d4ed8",
      color: "#fff",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      borderBottomColor: "#FFFFFF",
      outline: "1px solid #FFFFFF",
    },
  },
};

export const DataSensor = () => {
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [parameterFilter, setParameterFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);
  const [sort, setSort] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Fetch data
  const fetchData = async (page, size, filters = {}) => {
    try {
      const query = new URLSearchParams({
        ...filters,
        currentPage: page,
        pageSize: size,
      }).toString();
      const response = await fetch(
        `http://localhost:8081/api/sensors/search?${query}`
      );
      const data = await response.json();
      console.log(data);
      setRecords(data.records);
      setTotalRows(data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sortData = async (column, newSortOrder) => {
    try {
      const query = new URLSearchParams({ column, newSortOrder }).toString();
      const response = await fetch(
        `http://localhost:8081/api/sensors/sort?${query}`
      );
      const data = await response.json();
      console.log("data sorted: ", data);
      setRecords(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (column) => {
    const newSortOrder = sort === "desc" ? "asc" : "desc";
    setSort(newSortOrder);
    setActiveColumn(column);

    sortData(column, newSortOrder);
  };

  const sortIcon = (column) => {
    if (activeColumn === column) {
      if (sort === "asc")
        return <SortUp style={{ fontSize: "1.5rem", cursor: "pointer" }} />;
      if (sort === "desc")
        return <SortDown style={{ fontSize: "1.5rem", cursor: "pointer" }} />;
    }
    return <Sort style={{ fontSize: "1.5rem", cursor: "pointer" }} />;
  };

  const columns = [
    {
      name: (
        <>
          ID &nbsp;
          <span onClick={() => handleSort("id")}>{sortIcon("id")}</span>
        </>
      ),
      selector: (row) => row.id,
    },
    {
      name: (
        <>
          Nhiệt độ &nbsp;
          <span onClick={() => handleSort("temperature")}>
            {sortIcon("temperature")}
          </span>
        </>
      ),
      selector: (row) => row.temperature,
    },
    {
      name: (
        <>
          Độ ẩm &nbsp;
          <span onClick={() => handleSort("humidity")}>
            {sortIcon("humidity")}
          </span>
        </>
      ),
      selector: (row) => row.humidity,
    },
    {
      name: (
        <>
          Ánh sáng &nbsp;
          <span onClick={() => handleSort("lux")}>{sortIcon("lux")}</span>
        </>
      ),
      selector: (row) => row.lux,
    },
    {
      name: (
        <>
          Thời gian &nbsp;
          <span onClick={() => handleSort("date")}>{sortIcon("date")}</span>
        </>
      ),
      selector: (row) => row.date,
    },
  ];

  const handleSearch = () => {
    fetchData(currentPage, pageSize, {
      searchTerm,
      dateFilter,
      parameterFilter,
    });
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    fetchData(currentPage, newPageSize, {
      searchTerm,
      dateFilter,
      parameterFilter,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, pageSize, { searchTerm, dateFilter, parameterFilter });
  };

  return (
    <>
      <div className="data-sensor">
        <h2>Data Sensor</h2>
        <div className="table-filter">
          <div>
            <label htmlFor="search">Tìm kiếm:</label>
            <input
              id="search"
              type="text"
              placeholder="Nhập nội dung tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 items-end">
            <div>
              <label htmlFor="filter">Tìm kiếm theo:</label>
              <select
                id="filter"
                onChange={(e) => setParameterFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Temperature">Nhiệt độ</option>
                <option value="Humidity">Độ ẩm</option>
                <option value="Lux">Ánh sáng</option>
              </select>
            </div>
            <div>
              <label htmlFor="date">Nhập ngày:</label>
              <input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <button onClick={handleSearch}>Tìm kiếm</button>
          </div>
        </div>
        <DataTable
          data={records}
          columns={columns}
          customStyles={customStyles}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={pageSize}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          highlightOnHover
          pointerOnHover
        />
      </div>
    </>
  );
};
