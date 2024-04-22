import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/ShoppingCartContext";
import {
  BsPencilSquare, BsEraserFill, BsFillClipboardCheckFill,
  BsFillXSquareFill, BsArrowReturnRight, BsCheck2Square
} from "react-icons/bs";
import axios from 'axios';
import { API_URL } from "../App";
import { formatToMoney } from "../utils/FormatValues";

export const PayOrder = () => {
  const [cart, setCart] = useContext(CartContext);
  const [editQuantityState, setEditQuantityState] = useState(0);
  const [showUserLoginForm, setShowUserLoginForm] = useState(0);
  const [showVerifacteCredencials, setShowVerifacteCredencials] = useState(0);
  const [showConfirmOrderPay, setShowConfirmOrderPay] = useState(0);
  const [attemptUserLoginData, setAttemptUserLoginData] = useState({
    name: '',
    lastName: '',
    age: '0',
    email: '',
    password: '',
  });
  const [confirmedUserLoggedData, setConfirmedUserLoggedData] = useState({
    name: '',
    lastName: '',
    age: '0',
    email: '',
    password: '',
  });




  useEffect(() => {
    setEditQuantityState(false);
    setShowUserLoginForm(true);
    setShowVerifacteCredencials(false);
  }, []);

  const totalQuantity = cart.reduce((acc, curr) => {
    return acc + curr.cart_product_quantity;
  }, 0);

  const totalAmount = cart.reduce((acc, curr) => {
    return acc +
      curr.cart_product_quantity * curr.cart_product_amount

  }, 0);

  const removeFromCart = (singleOrderItem) => {
    const copyCart = [...cart];
    const itemCartFound = copyCart.findIndex(itemCart => itemCart.cart_product_object.id === singleOrderItem.id);
    if (itemCartFound !== -1) {
      copyCart.splice(itemCartFound, 1);
    } else {
    }
    setCart(copyCart);
  };



  const changeEditMode = () => {
    setEditQuantityState(!editQuantityState)
  };

  const getShowUserLoginForm = () => {
    return showUserLoginForm ? showUserLoginForm : false;
  }
  const getEditQuantityState = () => {
    return editQuantityState ? editQuantityState : false;
  };
  const getConfirmedUserLoggedData = () => {
    return confirmedUserLoggedData ? confirmedUserLoggedData : false;
  };
  const getShowConfirmOrderPay = () => {
    return showConfirmOrderPay ? showConfirmOrderPay : false;
  };

  const generateOrderObject = () => {
    const orderObjectLocal = {
      id_user: getConfirmedUserLoggedData().id,
      order_date: new Date(),
      order_quantity: totalQuantity,
      order_amount: totalAmount,
      order_product_list: cart.map(item => ({
        cart_product_id: item.cart_product_object.id,
        cart_product_quantity: item.cart_product_quantity,
        cart_product_amount: item.cart_product_amount
      })),
    };
    return orderObjectLocal
  };

  const handleChangeProductQuantity = (singleOrderItem, e) => {
    const { name, value } = e.target;
    let new_cart_product_quantity = parseInt(value);
    const copyCart = [...cart];
    const itemCartFound = copyCart.findIndex(itemCart => itemCart.cart_product_object.id === singleOrderItem.id);
    if (itemCartFound !== -1) {
      let same_cart_product_price = copyCart[itemCartFound].cart_product_object.product_price
      copyCart[itemCartFound] = {
        ...copyCart[itemCartFound],
        cart_product_quantity: new_cart_product_quantity,
        cart_product_amount: new_cart_product_quantity * same_cart_product_price
      };
    } else {
    }
    setCart(copyCart);
  };
  const handleChangeAttemptUserLoginData = (e) => {
    const { name, value } = e.target;
    setAttemptUserLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const HandleGetUserLoginValidation = async () => {
    try {
      await axios.post(API_URL + 'api/TiendaCarb/GetUserLoginValidation', attemptUserLoginData)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setConfirmedUserLoggedData(response.data[0])
            setShowUserLoginForm(false);
            setShowVerifacteCredencials(false);
          } else {
            setConfirmedUserLoggedData({
              name: '',
              lastName: '',
              age: '0',
              email: '',
              password: '',
            });
            setShowVerifacteCredencials(true)
            setShowUserLoginForm(true);
          }
          setAttemptUserLoginData({
            name: '',
            lastName: '',
            age: '0',
            email: '',
            password: '',
          });
          setShowVerifacteCredencials(false)
          setShowUserLoginForm(false);
          setShowConfirmOrderPay(false);

        })
        .catch(error => {
          console.err(error)

        });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const HandleAddOrder = async (newOrderObjectLocal) => {
    try {
      axios.post(API_URL + 'api/TiendaCarb/AddOrder', newOrderObjectLocal)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }

  };
  const confirmPayOrder = () => {
    const OrderObjectLocal = generateOrderObject()
    setShowUserLoginForm(false);
    setShowVerifacteCredencials(false);
    HandleAddOrder(OrderObjectLocal);

    setShowConfirmOrderPay(true);
    setTimeout(() => {
      setCart([]);
      setShowConfirmOrderPay(false);
      setShowUserLoginForm(true);
    }, 3000);
  };


  return (
    <>
      {getShowUserLoginForm() === true ? (
        <><h2>
          Login Form
        </h2><div className="table-wrap-container">
            <table className="table-form-order">
              <tr>
                <td>
                  <b>Email:</b>
                </td>
                <td>
                  <input className="td-input-login-page" maxLength="30" type="text"
                    name="email" value={attemptUserLoginData.email} placeholder="" onChange={handleChangeAttemptUserLoginData} />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Password:</b>
                </td>
                <td>
                  <input className="td-input-login-page" maxLength="30" type="password"
                    name="password" value={attemptUserLoginData.password} placeholder="" onChange={handleChangeAttemptUserLoginData} />
                </td>
              </tr>
              <tr>

                {showVerifacteCredencials ? (

                  <td colSpan="2">
                    "The email is not registred or password is wrong. Please try again."
                  </td>
                ) : (
                  <> <td colSpan="2"></td></>
                )}

              </tr>
              <tr>
                <td>
                  <div className="item-box-footer">
                    <button onClick={HandleGetUserLoginValidation} className="item-add-button-on">
                      <BsArrowReturnRight className='react-icons-bootstrap-icon-body' />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="item-box-footer">
                    <button className="item-minus-button-on">
                      <BsFillXSquareFill className='react-icons-bootstrap-icon-body' />
                    </button>
                  </div>
                </td>
              </tr>
            </table>
          </div></>
      ) : (

        <>
          <h2>Pay Order</h2>
          <div className="table-wrap-container">
            <table className="table-form-order">
              <tr>
                <td>
                  Welcome <b> {getConfirmedUserLoggedData().user_name} {getConfirmedUserLoggedData().user_last_name}</b>
                </td>
              </tr>

            </table>
          </div>
          <div className="table-wrap-container">
            <table className="table-data-order">
              <tr>
                <th className='th-table-page'>Code</th>
                <th className='th-table-page'>Name</th>
                <th className='th-table-page'>Engine</th>
                <th className='th-table-page'>Type</th>
                <th className='th-table-page'>Color</th>
                <th className='th-table-page'>Price</th>
                <th className='th-table-page'>Quantity</th>
                <th className='th-table-page'>Cost</th>
              </tr>
              {cart.map((singleOrderItem, index) => (
                <tr className={index % 2 === 0 ? 'tr-table-page-even' : 'tr-table-page-odd'} key={singleOrderItem.cart_product_object.id}>
                  <td>
                    {singleOrderItem.cart_product_object.product_code}
                  </td>
                  <td>
                    {singleOrderItem.cart_product_object.product_name}
                  </td>
                  <td>
                    {singleOrderItem.cart_product_object.product_engine}
                  </td>
                  <td>
                    {singleOrderItem.cart_product_object.product_type}
                  </td>
                  <td>
                    {singleOrderItem.cart_product_object.product_color}
                  </td>
                  <td>
                    {formatToMoney(singleOrderItem.cart_product_object.product_price)}
                  </td>
                  <th className='th-table-page-totals'>
                    {getEditQuantityState() === true ? (
                      <input className="td-input-number-table" type="number" min="1" max="999" name="cart_product_quantity"
                        value={singleOrderItem.cart_product_quantity} onChange={(e) => handleChangeProductQuantity(singleOrderItem.cart_product_object, e)}
                        placeholder="" />
                    ) : (
                      <>
                        {singleOrderItem.cart_product_quantity}
                      </>
                    )}
                  </th>
                  <th className='th-table-page-totals'>
                    {formatToMoney(singleOrderItem.cart_product_amount)}
                  </th>
                  <td>
                    <button onClick={() => removeFromCart(singleOrderItem.cart_product_object)} className="item-minus-button-on">
                      <BsEraserFill className='react-icons-bootstrap-icon-body' />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <th colSpan="6" className='th-table-page'>Total</th>
                <th className='th-table-page-totals'>{totalQuantity}</th>
                <th className='th-table-page-totals'>{formatToMoney(totalAmount)}</th>

              </tr>

              {getEditQuantityState() === true ? (
                <>
                  <tr>
                    <td td colSpan="4">
                      <div className="item-box-footer">
                        <button className="item-add-button-off">
                          <BsFillClipboardCheckFill className='react-icons-bootstrap-icon-body' />
                        </button>
                      </div>
                    </td>
                    <td colSpan="5">
                      <div className="item-box-footer">
                        <button onClick={() => changeEditMode()} className="item-add-button-on">
                          <BsPencilSquare className='react-icons-bootstrap-icon-body' />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td colSpan="4">
                      <div className="item-box-footer">
                        <button onClick={() => confirmPayOrder()} className="item-add-button-on">
                          <BsFillClipboardCheckFill className='react-icons-bootstrap-icon-body' />
                        </button>
                      </div>
                    </td>
                    <td colSpan="4">
                      <div className="item-box-footer">
                        <button onClick={() => changeEditMode()} className="item-modify-button">
                          <BsCheck2Square className='react-icons-bootstrap-icon-body' />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>

              )}
              {getShowConfirmOrderPay() === true ? (
                <><tr><b>Processing Payment...</b></tr></>
              ) : (
                <> </>
              )
              }
            </table>

          </div>


        </>
      )
      }


    </>
  );
};