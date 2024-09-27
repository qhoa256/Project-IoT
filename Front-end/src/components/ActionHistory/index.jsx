import { useState, useEffect } from "react";
import {
  FaSort as Sort,
  FaSortAmountDown as SortDown,
  FaSortAmountUpAlt as SortUp,
} from "react-icons/fa";
import "./styles.css";
import DataTable from "react-data-table-component";

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

export const ActionHistory = () => {
  const [record, setRecord] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("desc");
  const [activeColumn, setActiveColumn] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:8081/api/history/search?${query}`
      );
      const data = await response.json();
      setRecord(data.records);
      setTotalRows(data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sortData = async (column, newSortOrder) => {
    try {
      const query = new URLSearchParams({ column, newSortOrder }).toString();
      const response = await fetch(
        `http://localhost:8081/api/history/sort?${query}`
      );
      console.log(query);
      const data = await response.json();
      console.log("data sorted: ", data);
      setRecord(data);
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
          <span onClick={() => handleSort("id")}> {sortIcon("id")}</span>
        </>
      ),
      selector: (row) => row.id,
    },
    {
      name: (
        <>
          Thiết bị &nbsp;
          <span onClick={() => handleSort("device")}>{sortIcon("device")}</span>
        </>
      ),
      selector: (row) => row.device,
    },
    {
      name: (
        <>
          Hành động &nbsp;
          <span onClick={() => handleSort("action")}>{sortIcon("action")}</span>
        </>
      ),
      selector: (row) => row.action,
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
    fetchData({
      searchTerm,
      dateFilter,
      deviceFilter,
      pageSize,
      currentPage,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData({
      searchTerm,
      dateFilter,
      deviceFilter,
      pageSize,
      currentPage: page,
    });
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    fetchData({
      searchTerm,
      dateFilter,
      deviceFilter,
      pageSize: newPageSize,
      currentPage,
    });
  };

  useEffect(() => {
    fetchData({
      searchTerm,
      dateFilter,
      deviceFilter,
      pageSize,
      currentPage,
    });
  }, []);

  return (
    <div className="action-history">
      <h2>Action History</h2>
      <div className="table-filter">
        <div>
          <label>Tìm kiếm:</label>
          <input
            type="text"
            placeholder="Nhập nội dung tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> 
        <div className="grid grid-cols-3 items-end">
          <div>
            <label>Tìm kiếm theo:</label>
            <select onChange={(e) => setDeviceFilter(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="đèn">Đèn</option>
              <option value="điều hoà">Điều hoà</option>
              <option value="quạt">Quạt</option>
            </select>
          </div>
          <div>
            <label>Nhập ngày:</label>
            <input
              type="date"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
      </div>
      <DataTable
        data={record}
        columns={columns}
        customStyles={customStyles}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        highlightOnHover
        pointerOnHover
      />
    </div>
  );
};
