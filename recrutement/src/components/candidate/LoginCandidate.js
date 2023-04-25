import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function LoginCandidate() {
    const { setAuth, api} = useContext(Auth);
    let navigate = useNavigate();
    let location = useLocation();
    const [candidate, setCandidate] = useState({
        cin : '',
        password : '',
        errors: [],
        access : ''
    })
    function handleData(e) {
        setCandidate(data => ({
            ...data,
            [e.target.name]: e.target.value
        }))
    }
    async function sendData(e) {
        e.preventDefault();
        const data = {
            cin: candidate.cin,
            password: candidate.password
        }
        const login = await api.post('/api/log-candidate', data);
        if(login.data.status === "empty"){
            setCandidate(errorsList=>({
                ...errorsList,
                errors: login.data.messages
            }))
        }else if(login.data.status === "error"){
            setCandidate(accessError=>({
                ...accessError,
                access : login.data.data
            }))
        }else{
            navigate('/candidate/dashboard');
            setAuth(true);
            localStorage.setItem('tokenCa', login.data.data.token)
        }
    }
    return (
        <div className="anim">
            {candidate.access && <div className="alert alert-danger text-center w-75 mx-auto" role="alert">{candidate.access}</div>}
            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
            <div className="mt-4 w-75 mx-auto">
                <h4>Candidate</h4>
                <Form onSubmit={sendData}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>N° CIN</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="cin" 
                            placeholder="CIN N°"
                            onChange={handleData}
                            value={candidate.cin} 
                        />
                    <div>{candidate.errors.cin}</div>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mt-3">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control 
                            type="password"
                            name="password"
                            placeholder="Password" 
                            onChange={handleData}
                            value={candidate.password}
                        />
                    </Form.Group>
                    <div>{candidate.errors.password}</div>
                    <div className="d-flex align-items-center">
                        <Button variant="primary" type="submit" className="my-3">
                            Se connecter
                        </Button>
                        <div className="ms-2">
                            <h6><Link to='/candidate/register' className="text-decoration-none text-white">Ou s'inscrire ici</Link></h6>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}