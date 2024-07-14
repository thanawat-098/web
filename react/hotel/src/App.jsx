import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Products from "./Components/Products/Products";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Proceed_to_payment from "./Components/Proceed_to_payment/Proceed_to_payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/ptp"
          element={
            <PrivateRoute>
              <Proceed_to_payment />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
