import "./App.css";
import { Sidebar } from "./components/Sidebar";

import { DisplayContainer } from "./components/DisplayContainer";

const App = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/5 bg-slate-100">
        <Sidebar />
      </div>
      <div className="w-4/5">
        <DisplayContainer />
      </div>
    </div>
  );
};

export default App;
