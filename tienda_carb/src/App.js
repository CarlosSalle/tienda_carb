import React from "react";
import { ProductStore } from "./components/ProductStore";
import { Navbar } from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayOrder } from "./components/PayOrder";
import { ShoppingCartProvider } from "./contexts/ShoppingCartContext";
import { PagesMenu } from "./components/PagesMenu";
import { UserManagement } from "./components/UserManagement";
import { OrdersReport } from "./components/OrdersReport";
import './App.css';
export const API_URL="http://localhost:13770/";




  function App() {
  return (
    
    <ShoppingCartProvider>
    <Router>
      <Navbar />
      <PagesMenu/>
      <Routes>
        <Route path="/" element={<ProductStore />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/productStore" element={<ProductStore />} />
        <Route path="/payOrder" element={<PayOrder />} />
        <Route path="/OrdersReport" element={<OrdersReport />} />
        
      </Routes>
    </Router>
  </ShoppingCartProvider>
  );
}

export default App;
