import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrash3Fill, BsFloppyFill, BsFillInfoCircleFill, BsExclamationCircleFill } from "react-icons/bs";
import { API_URL } from "../App";

export const UserManagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '',
        lastName: '',
        age: '18',
        email: '',
        password: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        HandleGetUsersData();
    }, []);

    const HandleGetUsersData = async () => {
        try {
            const response = await axios.get(API_URL + 'api/TiendaCarb/GetAllUsers');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const HandleNewUserData = () => {
        const capitalizeFirstLetter = (text) => {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
        if (
            !newUser.name.trim() ||
            !newUser.lastName.trim() ||
            !newUser.age.trim() ||
            !newUser.email.trim() ||
            !newUser.password.trim()
        ) {
            setSuccessMessage('');
            setErrorMessage('Please fill fields');
            return;
        }
        const newUserNameCapitalized = newUser.name.split(' ').map(capitalizeFirstLetter).join(' ');
        const newUserlastNameCapitalized = newUser.lastName.split(' ').map(capitalizeFirstLetter).join(' ');

        setNewUser({
            ...newUser,
            name: newUserNameCapitalized,
            lastName: newUserlastNameCapitalized
        });
        if (!validateEmail(newUser.email)) {
            setSuccessMessage('');
            setErrorMessage('Fix Email Format');
            return;
        }
        try {
            axios.get(API_URL + 'api/TiendaCarb/GetAllUsers')
                .then(response => {
                    const allUsers = response.data;
                    const existingUser = allUsers.find(item => item.user_email == newUser.email);
                    if (existingUser) {
                        setSuccessMessage('');
                        setErrorMessage('Email is used');
                        return;
                    }
                    axios.post(API_URL + 'api/TiendaCarb/AddUser', newUser)
                        .then(() => {
                            HandleGetUsersData();
                            setNewUser({
                                name: '',
                                lastName: '',
                                age: '18',
                                email: '',
                                password: ''
                            });
                            setErrorMessage('');
                            setSuccessMessage('User Saved!');
                        })
                        .catch(error => {
                            setSuccessMessage('');
                            setErrorMessage('Error adding user: ' + error);
                        });
                })
                .catch(error => {
                    setSuccessMessage('');
                    setErrorMessage('Fetch Data: ' + error);
                });
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage(error);
        }
    };

    const handleDeleteUserData = async (userId) => {
        try {
            const response = await axios.delete(API_URL + `api/TiendaCarb/DeleteUser/${userId}`);
            HandleGetUsersData();
            setErrorMessage('');
            setSuccessMessage('User Deleted!');
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
        }
    };


    return (
        <><h2>User Management</h2>
            <div className="table-wrap-container">

                <table className='table-data-order'>
                    <tr>
                        <td colSpan="2">
                            <h2>Create New User</h2>
                        </td>
                    </tr>

                    <tr>
                        <td></td>
                        <td>
                            <input className="td-input-text-page" maxLength="30" type="text" name="name" value={newUser.name}
                                placeholder="New User Name" onChange={handleChange} />
                        </td>
                        <td>
                            <input className="td-input-text-page" maxLength="30" type="text" name="lastName" value={newUser.lastName}
                                placeholder="New User Last Name" onChange={handleChange} />
                        </td>
                        <td >
                            <input className="td-input-number-page" type="number" min="18" max="100" name="age" value={newUser.age}
                                placeholder="New User Age" onChange={handleChange} />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td >
                            <input className="td-input-login-page" maxLength="30" type="text" name="email" value={newUser.email}
                                placeholder="New User Email" onChange={handleChange} />
                        </td>
                        <td >
                            <input className="td-input-login-page" maxLength="30" type="password" name="password" value={newUser.password}
                                placeholder="New User Password" onChange={handleChange} />
                        </td>
                        <td >
                            <button onClick={HandleNewUserData} className="item-add-button-on">
                                <BsFloppyFill className='react-icons-bootstrap-icon-body' />
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan="2">
                            <h2>Consult All Users </h2>
                        </td>
                        <td /><td />
                        <td>
                            {errorMessage && <>
                                <div className="item-box-footer">
                                    <button className="item-minus-button-on">
                                        <BsExclamationCircleFill className="react-icons-bootstrap-icon-body" />
                                    </button>
                                    <p className='item-quantity'>
                                        {errorMessage}
                                    </p>
                                </div></>}
                        </td>
                        <td>
                            {successMessage && <>
                                <div className="item-box-footer">
                                    <button className="item-add-button-on">
                                        <BsFillInfoCircleFill className="react-icons-bootstrap-icon-body" />
                                    </button>
                                    <p className='item-quantity'>
                                        {successMessage}
                                    </p>
                                </div></>}
                        </td>
                        <td /><td />

                    </tr>

                    <tr>
                        <th className='th-table-page'># User </th>
                        <th className='th-table-page'>Name</th>
                        <th className='th-table-page'>Last Name</th>
                        <th className='th-table-page'>Age</th>
                        <th className='th-table-page'>Email</th>
                    </tr>

                    <tbody>
                        {allUsers.map((singleUser, index) => (
                            <tr className={index % 2 === 0 ? 'tr-table-page-even' : 'tr-table-page-odd'} key={singleUser.id}>
                                <td >{index + 1}</td>
                                <td >{singleUser.user_name}</td>
                                <td >{singleUser.user_last_name}</td>
                                <td >{singleUser.user_age}</td>
                                <td >{singleUser.user_email}</td>
                                <td >
                                    <button className="item-minus-button-on" onClick={() => handleDeleteUserData(singleUser.id)}>
                                        <BsFillTrash3Fill className='react-icons-bootstrap-icon-body' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></>
    );
};