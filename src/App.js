import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import './styling.css';
import DailySong from "./pages/DailySong";
import React, { useEffect, useState } from 'react';
import Footer from "./components/Footer";
import Product from "./pages/Product";
import ShoppingCart from "./pages/ShoppingCart";
import CartModal from "./components/CartModal";
const App = () => {
  
  const [navBarVisible, setNavBarVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [basket, setBasket] = useState([]);

  // function to hide or show header and footer
  const setHeaderAndFooter = (isVisible) => {
    setNavBarVisible(isVisible);
    setFooterVisible(isVisible);
  }

  const addToBasket = (productId, quantity) => {
    // check if product is in basket already (need to update the existing quantity)
    let productInBasket = false;
    let newBasket = basket.map((item) => {
      if(item["id"] == productId){
        productInBasket = true;
        return {"id": productId, "quantity": item["quantity"] + quantity};
      }else{
        return item;
      }
    });
    if(!productInBasket){
      newBasket = basket.concat({
          "id": productId, 
          "quantity": quantity
      });
    }
    setBasket(newBasket);
  }

  const removeFromBasket = (productId, quantity) => {
    let newProductQuantity;
    let productInBasket = false; 
    let newBasket = basket.map((item) => {
      if(item["id"] == productId){
        productInBasket = true;
        newProductQuantity = item["quantity"] - quantity;
        return {"id": productId, "quantity": newProductQuantity};
      }else{
        return item;
      }
    });
    if(newProductQuantity <= 0){
      newBasket = basket.filter((item) => item["id"] != productId);
    }
    setBasket(newBasket);
  }

  const getBasketCount = () => {
    let count = 0;
    basket.forEach(item => {
      count+=item["quantity"];
    });
    return count;
  }


  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    {navBarVisible ? <Navbar basket={basket} getBasketCount={getBasketCount}/> : null} 
    {cartModalVisible && <CartModal/>}
    <div className="page-content">
      <Routes>
        <Route path="/" 
          element={<Home setHeaderAndFooter={setHeaderAndFooter}/>}/>
        <Route path="/shop" element={<Shop />} />
        <Route path="/dailysong" element={<DailySong/>} />
        <Route path="/product" element ={<Product setCartModalVisible={setCartModalVisible} addToBasket={addToBasket}/>} />
        <Route path="/cart" element ={<ShoppingCart basket={basket} addToBasket={addToBasket} removeFromBasket={removeFromBasket}/>}/>
      </Routes>
    </div>
    {footerVisible ? <Footer /> : null}
      

    </BrowserRouter>
  );
};

export default App;