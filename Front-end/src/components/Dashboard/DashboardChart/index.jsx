import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./styles.css";

export const DashboardChart = (props) => {
  return (
    <div className="dashboard-chart">
      <h2 className="dashboard-chart__title">Biểu đồ 10 giá trị đo gần nhất</h2>
      <Line data={props.data} />
    </div>
  );
};
