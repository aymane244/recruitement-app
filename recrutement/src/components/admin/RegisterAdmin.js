import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
export default function RegisterAdmin() {
    let navigate = useNavigate();
    const [admin, setAdmin] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: '',
        errors: []
    })
    function handleData(e) {
        const { name, type, files, value } = e.target;
        setAdmin(data => ({
            ...data,
            [name]: type === "file" ? files[0] : value
        }))
    }
    function sendData(e) {
        e.preventDefault()
        const data = new FormData();
        data.append("first_name", admin.first_name);
        data.append("last_name", admin.last_name);
        data.append("email", admin.email);
        data.append("password", admin.password);
        data.append("password_confirmation", admin.password_confirmation);
        data.append("image", admin.image);
        axios.post("http://127.0.0.1:8000/api/register", data).then(res => {
            if(res.data.status === 200){
                setAdmin({
                    first_name :'',
                    last_name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    image: '',
                    errors: []
                })
                navigate('/admin', {state: res.data.message})
            }else if(res.data.status === 400){
                console.log(res.data.message_errors)
                setAdmin(dataErrors=>({
                    ...dataErrors,
                    errors : res.data.message_errors
                }))
            }
        })
    }
    return (
        <div>
            <Container className="my-5">
                <Link to='/admin'><i className="fa-solid fa-arrow-left arrow-style text-dark"></i></Link>
                <h2 className="text-center">S'inscrire</h2>
                <Form onSubmit={sendData}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <Form.Group controlId="firstName" className="mt-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Your first name"
                                    name="first_name"
                                    onChange={handleData}
                                    value={admin.first_name}
                                />
                            </Form.Group>
                            <div className="text-danger">{admin.errors.first_name}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="lastName" className="mt-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Your first name"
                                    name="last_name"
                                    onChange={handleData}
                                    value={admin.last_name}
                                />
                            </Form.Group>
                            <div className="text-danger">{admin.errors.last_name}</div>
                        </div>
                        <div className="col-md-4">
                            <Form.Group controlId="email" className="mt-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Your email adress"
                                    name="email"
                                    onChange={handleData}
                                    value={admin.email}
                                />
                            </Form.Group>
                            <div className="text-danger">{admin.errors.email}</div>
                        </div>
                        <div className="col-md-4">
                            <Form.Group controlId="password" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Your email password"
                                    name="password"
                                    onChange={handleData}
                                    value={admin.password}
                                />
                            </Form.Group>
                            <div className="text-danger">{admin.errors.password}</div>
                        </div>
                        <div className="col-md-4">
                            <Form.Group controlId="conf_pass" className="mt-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Your password confirmation"
                                    name="password_confirmation"
                                    onChange={handleData}
                                    value={admin.password_confirmation}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6 text-center">
                            <Form.Group controlId="image" className="mt-3">
                                <Form.Label className="file-label py-3">Votre photo (optionnellle)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    className="file"
                                    onChange={handleData}
                                />
                            </Form.Group>
                            <div className="text-danger">{admin.errors.image}</div>
                            <div>
                                {admin.image && <img src={URL.createObjectURL(admin.image)} className="w-image mx-auto" alt="" />}
                            </div>
                        </div>
                        <div>
                            <Button variant="primary" type="submit" className="my-3">Submit</Button>
                        </div>
                    </div>
                </Form>
            </Container>
        </div>
    )
}