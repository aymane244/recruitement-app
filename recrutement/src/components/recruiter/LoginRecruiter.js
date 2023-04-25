import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function LoginRecruiter() {
    const { setAuth, api} = useContext(Auth);
    let navigate = useNavigate();
    let location = useLocation();
    const [recruiter, setRecruiter] = useState({
        ice : '',
        password : '',
        errors: [],
        access : ''
    })
    function handleData(e) {
        setRecruiter(data => ({
            ...data,
            [e.target.name]: e.target.value
        }))
    }
    async function sendData(e) {
        e.preventDefault();
        const data = {
            ice: recruiter.ice,
            password: recruiter.password
        }
        const login = await api.post('/api/log-recruiter', data);
        if(login.data.status === "empty"){
            setRecruiter(errorsList=>({
                ...errorsList,
                errors: login.data.messages
            }))
        }else if(login.data.status === "error"){
            setRecruiter(accessError=>({
                ...accessError,
                access : login.data.data
            }))
        }else{
            navigate('/recruiter/dashboard');
            setAuth(true);
            localStorage.setItem('tokenRe', login.data.data.token)
        }
    }
    return (
        <div className="anim">
            {recruiter.access && <div className="alert alert-danger text-center w-75 mx-auto" role="alert">{recruiter.access}</div>}
            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
            <div className="mt-4 w-75 mx-auto">
                <h4>Recruiter</h4>
                <Form onSubmit={sendData}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>ICE de l'enreprise</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="ICE de l'entreprise"
                            name="ice"
                            onChange={handleData}
                            value={recruiter.ice}
                        />
                    </Form.Group>
                    <div>{recruiter.errors.password}</div>
                    <Form.Group controlId="formBasicPassword" className="mt-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password"
                            placeholder=""
                            name="password"
                            onChange={handleData}
                            value={recruiter.password}
                        />
                    </Form.Group>
                    <div>{recruiter.errors.password}</div>
                    <div className="d-flex align-items-center">
                        <Button variant="primary" type="submit" className="my-3">
                            Se connecter
                        </Button>
                        <div className="ms-2">
                            <h6><Link to='/recruiter/register' className="text-decoration-none text-white">Ou s'inscrire ici</Link></h6>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}