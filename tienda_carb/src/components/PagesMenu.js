import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
export const PagesMenu = () => {


    return (
        <div className="pages-menu-nav">
            <ul className="pages-menu-ul">
                <li class="pages-menu-li">
                    <Link to={"/userManagement"} className="pages-menu-li">
                        User Management
                    </Link>
                </li>

                <li class="pages-menu-li">
                    <Link to={"/productStore"} className="pages-menu-li">
                        Product Store
                    </Link>
                </li>
                <li class="pages-menu-li">
                    <Link to={"/OrdersReport"} className="pages-menu-li">
                        Orders Report
                    </Link>
                </li>
                <li class="pages-menu-li">
                    <Link to={"/payOrder"} className="pages-menu-li">
                        Pay Order
                    </Link>
                </li>
            </ul>
        </div>





    )


}