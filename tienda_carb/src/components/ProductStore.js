import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { API_URL } from "../App";
import {
  BsFillCartDashFill, BsFillCartPlusFill, BsOpticalAudioFill,
  BsJoystick, BsPalette, BsCurrencyDollar, BsFillCarFrontFill,
  BsFillSkipEndFill, BsFillSkipStartFill
} from "react-icons/bs";
import { CartContext } from "../contexts/ShoppingCartContext";
import { formatToMoney } from "../utils/FormatValues";

export const ProductStore = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  


  useEffect(() => {
    HandleGetProductsData();
  }, []);



  const HandleGetProductsData = async () => {
    try {
      const response = await axios.get(API_URL + 'api/TiendaCarb/GetAllProducts');
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const addToCart = (singleProductParam) => {
    const copyCart = [...cart];
    const productToAdd = allProducts.find(product => product.id === singleProductParam.id);
    if (!productToAdd) return;
    const itemCartFound = copyCart.findIndex(itemCart => itemCart.cart_product_object.id === singleProductParam.id);
    if (itemCartFound !== -1) {
      copyCart[itemCartFound].cart_product_quantity += 1;
      copyCart[itemCartFound].cart_product_amount += singleProductParam.product_price;
    } else {
      copyCart.push({
        cart_product_object: singleProductParam,
        cart_product_quantity: 1,
        cart_product_amount: singleProductParam.product_price
      })

    }
    setCart(copyCart);
  };

  const removeFromCart = (singleProductParam) => {
    const copyCart = [...cart];
    const productToMinus = allProducts.find(product => product.id === singleProductParam.id);
    if (!productToMinus) return;
    const itemCartFound = copyCart.findIndex(itemCart => itemCart.cart_product_object.id === singleProductParam.id);    
    if (itemCartFound !== -1) {
      copyCart[itemCartFound].cart_product_quantity -= 1;
      copyCart[itemCartFound].cart_product_amount -= singleProductParam.product_price;
    } else {
    }
    setCart(copyCart);
  };

  const getQuantityById = (singleProductParamId) => {

    const itemCartFound = cart.find(itemCart => itemCart.cart_product_object.id === singleProductParamId);
    return itemCartFound ? itemCartFound.cart_product_quantity : 0;

  };

  return (
    <div>
      <h2>Product Store</h2>
      <div className="item-box-footer">
        <button className="item-action-button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <BsFillSkipStartFill className="react-icons-bootstrap-icon-body" />
        </button>
        <p className="item-quantity">
          {currentPage} / {parseInt((allProducts.length / productsPerPage) + 1, 10)}
        </p>
        <button className="item-action-button" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= allProducts.length}>
          <BsFillSkipEndFill className="react-icons-bootstrap-icon-body" />
        </button>
      </div>

      <div className="items-list">
        {currentProducts.map((singleProduct, index) => (

          <div className="item-box" key={singleProduct.id}>
            <div className="item-box-header">
              <p className="item-title">{singleProduct.product_name}</p>
            </div>
            <table className="table-products-results">
              <tbody>
                <tr>
                  <td>
                    <img src={singleProduct.product_image} className="img-area" />
                  </td>
                  <table>
                    <tr>
                      <td>
                        <button className="item-label-button">
                          <BsOpticalAudioFill className="react-icons-bootstrap-icon-body" />
                        </button>
                        <p className="item-quantity">
                          {singleProduct.product_engine}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button className="item-label-button">
                          <BsJoystick className="react-icons-bootstrap-icon-body" />
                        </button>
                        <p className="item-quantity">
                          {singleProduct.product_type}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button className="item-label-button">
                          <BsPalette className="react-icons-bootstrap-icon-body" />
                        </button>
                        <p className="item-quantity">
                          <button className={`item-color-mark-${singleProduct.product_color ? singleProduct.product_color.toLowerCase().replace(" ", "-") : 'item-color-mark-white'}`} />
                        </p>
                      </td>
                    </tr>
                  </table>
                  <td>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <div className="td-table-page">

                      <p className="item-quantity">
                        {singleProduct.product_description}
                        <br />CODE: {singleProduct.product_code}
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <hr />
                    <div className="item-box-footer">
                      <button className="item-label-button">
                        <BsCurrencyDollar className="react-icons-bootstrap-icon-body" />
                      </button>
                      <p className="item-quantity">
                        {formatToMoney(singleProduct.product_price)}
                      </p>
                      <button className="item-label-button">
                        <BsFillCarFrontFill className="react-icons-bootstrap-icon-body" />
                      </button>
                      <p className="item-quantity">
                        {singleProduct.product_stock}
                      </p>

                      {getQuantityById(singleProduct.id) > 0 ? (
                        <button className="item-minus-button-on" onClick={() => removeFromCart(singleProduct)}>
                          <BsFillCartDashFill className="react-icons-bootstrap-icon-body" />
                        </button>
                      ) : (
                        <button className="item-minus-button-off">
                          <BsFillCartDashFill className="react-icons-bootstrap-icon-body" />
                        </button>
                      )}
                      <p className="item-quantity">{getQuantityById(singleProduct.id)}</p>
                      {singleProduct.product_stock > getQuantityById(singleProduct.id) ? (
                        <button className="item-add-button-on" onClick={() => addToCart(singleProduct)}>
                          <BsFillCartPlusFill className="react-icons-bootstrap-icon-body" />
                        </button>
                      ) : (
                        <button className="item-add-button-off">
                          <BsFillCartPlusFill className="react-icons-bootstrap-icon-body" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
          </div>

        ))}
      </div>
      <div className="item-box-footer">
        <button className="item-action-button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <BsFillSkipStartFill className="react-icons-bootstrap-icon-body" />
        </button>
        <p className="item-quantity">
          {currentPage} / {parseInt((allProducts.length / productsPerPage) + 1, 10)}
        </p>
        <button className="item-action-button" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= allProducts.length}>
          <BsFillSkipEndFill className="react-icons-bootstrap-icon-body" />
        </button>
      </div>
    </div>
  );
};