import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Navbar from "./components/navbar";
import './styling.css';
import DailySong from "./pages/DailySong";
import React, { useState } from 'react';
import Footer from "./components/Footer";
import Product from "./pages/Product";

const App = () => {
  const [navBarVisible, setNavBarVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    {navBarVisible ? <Navbar /> : null} 
      <div className="page-content">
        <Routes>
          <Route path="/" 
            element={<Home setNavBarVisible={setNavBarVisible} setFooterVisible = {setFooterVisible} />}/>
          <Route path="/shop" element={<Shop />} />
          <Route path="/dailysong" element={<DailySong />} />
          {/* <Route path="/product/1" element ={<Product />} /> */}
        </Routes>
      </div>
      {footerVisible ? <Footer /> : null}
      

    </BrowserRouter>
  );
};

export default App;