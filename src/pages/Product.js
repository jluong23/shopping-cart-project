// Product.js
import {Link, useSearchParams } from "react-router-dom";
import React from "react";
import productData from "../products.json";
import QuantityInput from "../components/QuantityInput";
import Button from 'react-bootstrap/Button';
const Product = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const errorMsg = (
      <div>
        <h1>Error, this product does not exist...</h1>
      </div>
    )
    let productId = searchParams.get("id"); //get id by get request
    let product = productData.find(p => 
      p.id == productId
    );
    if(product == null){
      return errorMsg
    }
    // successful case where product exists
    return (
      <div className="product">
        <div className='product-image'>
          <img src= {product.img} alt={product.name + " Album Cover"}  />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-purchase">
            <p>{product.price}</p>
            <QuantityInput />
            <Button variant="warning">Add to Basket</Button>
          </div>
          <p>{product.description}</p>
        </div>
      </div>
    );
  };
  
export default Product;