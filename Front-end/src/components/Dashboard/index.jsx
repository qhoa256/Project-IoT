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
    // Kẹp giá trị nhiệt độ trong khoảng từ 0 đến 50
    const clampedTemp = Math.max(0, Math.min(temperature, 50));
  
    // Xanh lá cây khi nhiệt độ thấp và đỏ khi nhiệt độ cao
    const redComponent = Math.round((clampedTemp / 50) * 255);  // Tăng từ 0 đến 255
    const greenComponent = Math.round(255 - (clampedTemp / 50) * 255);  // Giảm từ 255 đến 0
  
    return `rgb(${redComponent}, ${greenComponent}, 0)`;  // Xanh chuyển dần sang đỏ
  };

  const getHumidityColor = (humidity) => {
    // Kẹp giá trị độ ẩm trong khoảng từ 0 đến 100
    const clampedHumi = Math.max(0, Math.min(humidity, 100));
  
    // Xanh dương nhạt (màu #ADD8E6) khi độ ẩm thấp và xanh dương đậm (màu #00008B) khi độ ẩm cao
    const redComponent = Math.round(173 - (clampedHumi / 100) * 173); // Giảm từ 173 đến 0
    const greenComponent = Math.round(216 - (clampedHumi / 100) * 216); // Giảm từ 216 đến 0
    const blueComponent = Math.round(230 - (clampedHumi / 100) * (230 - 139)); // Tăng từ 230 đến 139 (xanh dương)
  
    return `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;  // Xanh nhạt đến xanh đậm
  };

  const getLuxColor = (lux) => {
    // Kẹp giá trị ánh sáng trong khoảng từ 0 đến 400
    const clampedLux = Math.min(Math.max(lux, 0), 400);
  
    // Màu cơ bản ở 0 lux (xám - #808080)
    const baseRed = 128;
    const baseGreen = 128;
    const baseBlue = 128;
  
    // Màu mục tiêu ở 400 lux (vàng - #FACC15)
    const targetRed = 250;
    const targetGreen = 204;
    const targetBlue = 21;
  
    // Nội suy màu giữa màu cơ bản và màu mục tiêu
    const red = Math.floor(baseRed + (targetRed - baseRed) * (clampedLux / 400));
    const green = Math.floor(baseGreen + (targetGreen - baseGreen) * (clampedLux / 400));
    const blue = Math.floor(baseBlue + (targetBlue - baseBlue) * (clampedLux / 400));
  
    return `rgb(${red}, ${green}, ${blue})`;  // Xám chuyển dần sang vàng
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
