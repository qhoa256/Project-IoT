import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";
import {
  faFan,
  faLightbulb,
  faSnowflake,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const DashboardControls = () => {
  const [fanStatus, setFanStatus] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);
  const [acStatus, setAcStatus] = useState(false);
  const [loading, setLoading] = useState({
    fan: false,
    light: false,
    ac: false,
  });

  // Hàm lưu trạng thái vào localStorage
  const saveToLocalStorage = (device, status) => {
    localStorage.setItem(device, JSON.stringify(status));
  };

  // Hàm lấy trạng thái từ localStorage
  const getFromLocalStorage = (device) => {
    const storedStatus = localStorage.getItem(device);
    return storedStatus ? JSON.parse(storedStatus) : null;
  };

  const fetchData = async () => {
    const response = await fetch("http://localhost:8081/api/sensors/status");
    const data = await response.json();

    const storedFanStatus = getFromLocalStorage("fanStatus");
    const storedLightStatus = getFromLocalStorage("lightStatus");
    const storedAcStatus = getFromLocalStorage("acStatus");

    setFanStatus(storedFanStatus !== null ? storedFanStatus : data[0].fan === 1);
    setLightStatus(storedLightStatus !== null ? storedLightStatus : data[0].light === 1);
    setAcStatus(storedAcStatus !== null ? storedAcStatus : data[0].ac === 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (actionData = {}) => {
    const { device, action } = actionData;
    setLoading((prev) => ({ ...prev, [device]: true }));

    const queryString = new URLSearchParams(actionData).toString();

    try {
      const response = await fetch(
        `http://localhost:8081/api/devices/actiondata?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.action === "on") {
        if (device === "fan") {
          setFanStatus(true);
          saveToLocalStorage("fanStatus", true);
        }
        if (device === "light") {
          setLightStatus(true);
          saveToLocalStorage("lightStatus", true);
        }
        if (device === "ac") {
          setAcStatus(true);
          saveToLocalStorage("acStatus", true);
        }
      } else if (data.action === "off") {
        if (device === "fan") {
          setFanStatus(false);
          saveToLocalStorage("fanStatus", false);
        }
        if (device === "light") {
          setLightStatus(false);
          saveToLocalStorage("lightStatus", false);
        }
        if (device === "ac") {
          setAcStatus(false);
          saveToLocalStorage("acStatus", false);
        }
      }
    } catch (error) {
      console.error("Error in handleAction:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [device]: false }));
    }
  };

  const handleFanClick = async () => {
    handleAction({ device: "fan", action: fanStatus ? "off" : "on" });
  };

  const handleAcClick = () => {
    handleAction({ device: "ac", action: acStatus ? "off" : "on" });
  };

  const handleLightClick = () => {
    handleAction({ device: "light", action: lightStatus ? "off" : "on" });
  };

  return (
    <div className="dashboard-controls">
      <h2 className="dashboard-controls__title">Điều khiển thiết bị</h2>
      <div className="dashboard-devices">
        <div
          className={`dashboard-device__item ${fanStatus ? "on" : "off"}`}
          onClick={handleFanClick}
        >
          {!loading.fan ? (
            <>
              <FontAwesomeIcon className="fan" icon={faFan} />
              <span>Quạt</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon className="spinner" icon={faSpinner} />
              <span>Loading</span>
            </>
          )}
        </div>

        <div
          className={`dashboard-device__item ${acStatus ? "on" : "off"}`}
          onClick={handleAcClick}
        >
          {!loading.ac ? (
            <>
              <FontAwesomeIcon className="snow" icon={faSnowflake} />
              <span>Điều hoà</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon className="spinner" icon={faSpinner} />
              <span>Loading</span>
            </>
          )}
        </div>

        <div
          className={`dashboard-device__item ${lightStatus ? "on" : "off"}`}
          onClick={handleLightClick}
        >
          {!loading.light ? (
            <>
              <FontAwesomeIcon className="light" icon={faLightbulb} />
              <span>Đèn</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon className="spinner" icon={faSpinner} />
              <span>Loading</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};