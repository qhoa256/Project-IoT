import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";
import {
  faDroplet,
  faSun,
  faTemperatureThreeQuarters,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { DashboardChart } from "./DashboardChart";
import { DashboardControls } from "./DashboardControls";

export const Dashboard = () => {
  const [temp, setTemp] = useState("");
  const [moisture, setMoisture] = useState("");
  const [light, setLight] = useState("");
  const [data, setData] = useState({
    temperature: [],
    humidity: [],
    lux: [],
  });
  
  const [chartData, setChartData] = useState({
    labels: ["18s", "16s", "14s", "12s", "10s", "8s", "6s", "4s", "2s", "Hiện tại"],
    datasets: [
      {
        label: "Nhiệt độ",
        data: [],
        fill: false,
        borderColor: "#F87171",
        tension: 0.1,
      },
      {
        label: "Độ ẩm",
        data: [],
        fill: false,
        borderColor: "#60A5FA",
        tension: 0.1,
      },
      {
        label: "Ánh sáng",
        data: [],
        fill: false,
        borderColor: "#FACC15",
        tension: 0.1,
      },
    ],

  });
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/sensors/status");
      const data = await response.json();

      setTemp(data[0].Temperature);
      setMoisture(data[0].Humidity);
      setLight(data[0].Lux);
      
      const tempData = data.map((item) => item.Temperature).reverse();
      const humidityData = data.map((item) => item.Humidity).reverse();
      const luxData = data.map((item) => item.Lux).reverse();
      setData({
        temperature: tempData,
        humidity: humidityData,
        lux: luxData,
      });
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };
  
  useEffect(() => {
    setChartData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: data.temperature,
        },
        {
          ...prev.datasets[1],
          data: data.humidity,
        },
        {
          ...prev.datasets[2],
          data: data.lux,
        },
      ],
    }));
  }, [data]);
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getTempColor = (temperature) => {
    if (temperature <= 10) return "#fca5a5";
    else if (temperature <= 20) return "#f87171";
    else if (temperature <= 30) return "#ef4444";
    else if (temperature <= 40) return "#dc2626";
    return "#b91c1c";
  };

  const getHumidityColor = (humidity) => {
    if (humidity <= 60) return "#93c5fd";
    else if (humidity <= 70) return "#60a5fa";
    else if (humidity <= 80) return "#3b82f6";
    else if (humidity <= 90) return "#2563eb";
    return "#1d4ed8";
  };

  const getLuxColor = (lux) => {
    if (lux <= 50) return "#4b5563";
    else if (lux <= 100) return "#6b7280";
    else if (lux <= 150) return "#9ca3af";
    else if (lux <= 200) return "#d1d5db";
    else if (lux <= 250) return "#fef9c3";
    else if (lux <= 300) return "#fef08a";
    else if(lux <= 350) return "#fde047";
    else if(lux <= 400) return "#facc15";
    return "#eab308";
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-status">
        <h2>Thông số hiện tại</h2>
        <div className="dashboard-status__list">
          <div className="dashboard-status__item " style={{backgroundColor: getTempColor(temp)}}>
            <div className="dashboard-status__item-title">Nhiệt độ</div>
            <div className="dashboard-status__item-img">
              <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </div>
            <div className="dashboard-status__item-data">{temp}°C</div>
          </div>
          <div className="dashboard-status__item" style={{backgroundColor: getHumidityColor(moisture)}}>
            <div className="dashboard-status__item-title">Độ ẩm</div>
            <div className="dashboard-status__item-img">
              <FontAwesomeIcon icon={faDroplet} />
            </div>
            <div className="dashboard-status__item-data">{moisture}%</div>
          </div>

          <div className="dashboard-status__item" style={{backgroundColor: getLuxColor(light)}}>
            <div className="dashboard-status__item-title">Ánh sáng</div>
            <div className="dashboard-status__item-img">
              <FontAwesomeIcon icon={faSun} />
            </div>
            <div className="dashboard-status__item-data">{light} Lux</div>
          </div>
        </div>
      </div>
      <div className="dashboard-function">
        <div className="w-2/3">
          <DashboardChart data={chartData} />
        </div>
        <div className="w-1/3">
          <DashboardControls />
        </div>
      </div>
    </div>
  );
};
