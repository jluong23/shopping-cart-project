// Home.js

import React, {useEffect} from "react";
import homeImageFile from "../assets/john.jpg"
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";



const Home = (props) => {
  useEffect(() => {
    // hide nav bar and footer on home
    props.setHeaderAndFooter(false);
    return function cleanup(){
      // return the header and footer on other pages
      props.setHeaderAndFooter(true);
    }
  });
  

  return (
    <div className="home">
      <div className="home-image">
        <img src={homeImageFile} alt="Home image of John Mayer"/>
      </div>
      <div className="home-description">
        <h1>
          John Mayer Fan Shop
        </h1>
      </div>
      <div className="home-options">
        <Link to ="/shop">
          <Button size="lg" variant="warning">Go to shop</Button>
        </Link>
        <Link to ="/dailysong">
          <Button size="lg" variant="success">Daily Song</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;