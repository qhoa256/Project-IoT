import { Dashboard } from "../Dashboard";
import { ProfileInfo } from "../ProfileInfo";
import { DataSensor } from "../DataSensor";
import { ActionHistory } from "../ActionHistory";
import { Route, Routes } from "react-router-dom";
import "./styles.css";

export const DisplayContainer = () => {
  return (
    <div className="display-container">
      <Routes>
        <Route exact path="/" element={<Dashboard />}></Route>
        <Route exact path="/data" element={<DataSensor />}></Route>
        <Route exact path="/history" element={<ActionHistory />}></Route>
        <Route exact path="/profile" element={<ProfileInfo />}></Route>
      </Routes>
    </div>
  );
};
