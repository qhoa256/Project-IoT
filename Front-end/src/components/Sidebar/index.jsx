import { Link } from "react-router-dom";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faDatabase,
  faGauge,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">Admin page</div>
      <div className="sidebar-card">
        <p>
          <FontAwesomeIcon icon={faUser} />
        </p>
        <span>Nguyễn Hữu Quang Hoà</span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/">
            <FontAwesomeIcon icon={faGauge} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/data">
            <FontAwesomeIcon icon={faDatabase} />
            <span>Data Sensor</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/history">
            <FontAwesomeIcon icon={faClock} />
            <span>Action History</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
