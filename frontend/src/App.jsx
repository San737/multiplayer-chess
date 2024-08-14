import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';

import { Landing } from "./screens/Landing";
import { ComputerGame } from "./screens/ComputerGame";
import { OnlineGame } from "./screens/OnlineGame";
import { Previousgames } from "./screens/Previousgames";
import { Userstatistics } from "./screens/Userstatistics";
import { Login } from "./components/Login";
import { Register } from "./screens/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<ComputerGame />} />
          <Route path="/online" element={<OnlineGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/previousgames" element={<Previousgames userId={2} />} />
          <Route path="/userstatistics" element={<Userstatistics />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
