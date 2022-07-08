import React from 'react';

const ShopProduct = (props) =>{
  return (
    <div className='shop-product'>
      <img src= {props.product.img}/>
      <h2>{props.product.name}</h2>
    </div>
  )
}

export default ShopProduct;