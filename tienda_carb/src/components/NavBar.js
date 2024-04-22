import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/ShoppingCartContext";
import { BsCartFill } from "react-icons/bs";




export const Navbar = () => {
  const [cart, setCart] = useContext(CartContext);

  const totalQuantity = cart.reduce((acc, curr) => {
    return acc + curr.cart_product_quantity;
  }, 0);

  return (
    <nav>
      <Link to={"/"} className="nav-bar-link-style">
        <div className="nav-bar-company-name">
          <h1>CAR DISTRIBUTION STORE</h1>
        </div>
      </Link>
      <ul className="nav-list">
        <div className="item-box-header">
          <button className="total-item-cart-button">
            <BsCartFill className="react-icons-bootstrap-icon-head" >
            </BsCartFill>
            <span className="cart-count">{totalQuantity}</span>
          </button>

          <span></span>


        </div>
      </ul>
    </nav>



  );
};