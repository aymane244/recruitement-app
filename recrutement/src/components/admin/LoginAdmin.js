import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Auth } from "../context/AuthContext";

export default function LoginAdmin() {
    const { setAuth, api} = useContext(Auth);
    let location = useLocation();
    let navigate = useNavigate();
    const [admin, setAdmin] = useState({
        email: '',
        password: '',
        errors: [],
        access : ''
    });
    function handleData(e) {
        setAdmin(data => ({
            ...data,
            [e.target.name]: e.target.value
        }))
    }
    async function loginAdmin(e) {
        e.preventDefault();
        const data = {
            email: admin.email,
            password: admin.password
        }
        const login = await api.post('/api/login', data);
        if(login.data.status === "empty"){
            setAdmin(errorsList=>({
                ...errorsList,
                errors: login.data.messages
            }))
        }else if(login.data.status === "error"){
            setAdmin(accessError=>({
                ...accessError,
                access : login.data.data
            }))
        }else{
            navigate('dashboard/');
            setAuth(true);
            localStorage.setItem('token', login.data.data.token)
        }
    }
    return (
        <div>
            <div className="mt-5 w-75 mx-auto">
                <h2 className="my-3 text-center">Administrateur</h2>
                {admin.access && <div className="alert alert-danger text-center" role="alert">{admin.access}</div>}
                {location.state && <div className="alert alert-success text-center" role="alert">{location.state}</div>}
                <div className="bg-white px-5 py-4 rounded shadow border w-75 mx-auto mt-5">
                    <Form onSubmit={loginAdmin}>
                        <Form.Group controlId="formBasicEmail" className="w-75 mx-auto">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email"
                                placeholder="Your email"
                                name="email"
                                onChange={handleData}
                                value={admin.email}
                            />
                        <div className="text-danger">{admin.errors.email}</div>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mt-3 w-75 mx-auto">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleData}
                                value={admin.password}
                            />
                        <div className="text-danger">{admin.errors.password}</div>
                        </Form.Group>
                        <div className="d-flex align-items-center w-75 mx-auto">
                            <Button variant="primary" type="submit" className="my-3">
                                Se connecter
                            </Button>
                            <div className="ms-2">
                                <h6><Link to='/admin/register' className="text-decoration-none text-dark">Ou s'inscrire ici</Link></h6>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}