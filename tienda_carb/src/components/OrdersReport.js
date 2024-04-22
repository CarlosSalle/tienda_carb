import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from "../contexts/ShoppingCartContext";
import axios from 'axios';
import { API_URL } from "../App";
import { formatToMoney } from "../utils/FormatValues";
export const OrdersReport = () => {

    const [allOrderReports, setAllOrderReports] = useState([]);
    useEffect(() => {
        HandleGetOrdersReport();
    }, []);

    const getOrderDetailsInfoList = (orderDetailsInfo, isFormatValues) => {
        const orderDetailsInfoLocal = orderDetailsInfo ? orderDetailsInfo.split('<br />') : [];
        let HTMLorderDetailsInfoList = []
        if (isFormatValues) {
            HTMLorderDetailsInfoList =
                <div>
                    {orderDetailsInfoLocal.map((item, index) => (
                        <tr key={index}>
                            $ {formatToMoney(item)}
                            <br />
                        </tr>
                    ))}
                </div>
        } else {
            HTMLorderDetailsInfoList =
                <div>
                    {orderDetailsInfoLocal.map((item, index) => (
                        <tr key={index}>
                            {item}
                            <br />
                        </tr>
                    ))}
                </div>
        }
        return HTMLorderDetailsInfoList
    }
    const HandleGetOrdersReport = async () => {
        try {
            const response = await axios.get(API_URL + 'api/TiendaCarb/GetAllOrderReports');
            setAllOrderReports(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
        }
    };
    return (
        <><h2>Orders Report</h2>
            <div className="table-wrap-container">
                <table className='table-data-order'>
                    <tr>
                        <th className='th-table-page'># </th>
                        <th className='th-table-page'>User</th>
                        <th className='th-table-page'>Date</th>
                        <th className='th-table-page'>Items </th>
                        <th className='th-table-page'>Payment</th>
                        <th className='th-table-page'>Product Code</th>
                        <th className='th-table-page'>Quantity</th>
                        <th className='th-table-page'>Cost</th>
                    </tr>
                    <tbody>
                        {allOrderReports.map((singleOrderReport, index) => (
                            <tr className={index % 2 === 0 ? 'tr-table-page-even' : 'tr-table-page-odd'} key={singleOrderReport.id}>
                                <td >{index + 1}</td>
                                <td >{singleOrderReport.full_user_name}</td>
                                <td >{singleOrderReport.order_date.slice(0, 10)}</td>
                                <td >{singleOrderReport.order_quantity}</td>
                                <td ><tr>$ {formatToMoney(singleOrderReport.order_amount)}</tr></td>
                                <td >{getOrderDetailsInfoList(singleOrderReport.product_codes, false)}</td>
                                <td >{getOrderDetailsInfoList(singleOrderReport.product_quantities, false)}</td>
                                <td >{getOrderDetailsInfoList(singleOrderReport.product_amounts, true)}</td>
                                <td >{ }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </>
    )
}