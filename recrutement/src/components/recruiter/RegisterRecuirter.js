import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterRecuirter() {
    let navigate = useNavigate();
    const [register, setRegister] = useState({
        name: '',
        email: '',
        ice: '',
        registre: '',
        recruiter_adress: '',
        recruiter_country: '',
        recruiter_city : '',
        password: '',
        password_confirmation: '',
        logo: '',
        scan: '',
        error: []
    });
    function handleData(e) {
        const { name, files, value, type } = e.target;
        setRegister(formData => ({
            ...formData,
            [name]: type === "file" ? files[0] : value
        }))
    }
    function sendData(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("name", register.name);
        data.append("logo", register.logo);
        data.append("email", register.email);
        data.append("ice", register.ice);
        data.append("registre", register.registre);
        data.append("recruiter_adress", register.recruiter_adress);
        data.append("recruiter_country", register.recruiter_country);
        data.append("recruiter_city", register.recruiter_city);
        data.append("scan", register.scan);
        data.append("password", register.password);
        data.append("password_confirmation", register.password_confirmation);
        axios.post("http://127.0.0.1:8000/api/add-recruiter", data).then(response => {
            if (response.data.status === 200) {
                setRegister({
                    name: '',
                    email: '',
                    ice: '',
                    registre: '',
                    recruiter_adress: '',
                    recruiter_country: '',
                    recruiter_city : '',
                    password: '',
                    password_confirmation: '',
                    logo: '',
                    scan: '',
                    error: []
                })
                navigate('/login', {state: response.data.message})
            } else if (response.data.status === 400) {
                setRegister(errors => ({
                    ...errors,
                    error: response.data.message_errors,
                }))
            }
        })
    }
    const img_pdf = <img src="/images/pdf.png" alt="" />
    return (
        <div className="mt-5">
            <Container>
                <Link to='/login'><i className="fa-solid fa-arrow-left arrow-style text-dark"></i></Link>
                <h2 className="text-center">S'inscrire</h2>
                <Form onSubmit={sendData}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicName" className="mt-3">
                                <Form.Label>Nom de l'entreprise</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nom de l'entreprise"
                                    name="name"
                                    onChange={handleData}
                                    value={register.name}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.name}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicEmail" className="mt-3">
                                <Form.Label>L'email de l'entreprise</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="L'email de l'entreprise"
                                    name="email"
                                    onChange={handleData}
                                    value={register.email}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.email}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicIce" className="mt-3">
                                <Form.Label>ICE de l'entreprise</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="ICE"
                                    name="ice"
                                    onChange={handleData}
                                    value={register.ice}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.ice}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicRc" className="mt-3">
                                <Form.Label>N° de registre de commerce</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre de commerce"
                                    name="registre"
                                    onChange={handleData}
                                    value={register.registre}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.registre}</div>
                        </div>
                        <div className="col-md-12">
                            <Form.Group controlId="formBasicAdress" className="mt-3">
                                <Form.Label>L'adresse de l'entreprise</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Adresse de l'entreprise"
                                    name="recruiter_adress"
                                    onChange={handleData}
                                    value={register.recruiter_adress}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.recruiter_adress}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicCountry" className="mt-3">
                                <Form.Label>Pays</Form.Label>
                                <Form.Control
                                    id="formBasicCountry"
                                    type="text"
                                    placeholder="Pays"
                                    name="recruiter_country"
                                    onChange={handleData}
                                    value={register.recruiter_country}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.recruiter_country}</div>
                        </div>
                         <div className="col-md-6">
                            <Form.Group controlId="formBasicCity" className="mt-3">
                                <Form.Label>Ville</Form.Label>
                                <Form.Control
                                    id="formBasicCity"
                                    type="text"
                                    placeholder="Ville"
                                    name="recruiter_city"
                                    onChange={handleData}
                                    value={register.recruiter_city}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.recruiter_city}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicPassword" className="mt-3">
                                <Form.Label>Mot de passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Votre mot de passe"
                                    name="password"
                                    onChange={handleData}
                                    value={register.password}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.password}</div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
                                <Form.Label>Confirmé mot de passe </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder=""
                                    name="password_confirmation"
                                    onChange={handleData}
                                    value={register.password_confirmation}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6 text-center">
                            <Form.Group controlId="fromBasicFile" className="mt-3">
                                <Form.Label className="file-label py-3">ICE Scanné</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="scan"
                                    className="file"
                                    onChange={handleData}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.scan}</div>
                            <div>
                                <p>{register.scan.name ? img_pdf : ''}</p>
                                <p>{register.scan.name}</p>
                            </div>
                        </div>
                        <div className="col-md-6 text-center">
                            <Form.Group controlId="fromBasicImage" className="mt-3">
                                <Form.Label className="file-label py-3">Logo de l'entreprise</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="logo"
                                    className="file"
                                    onChange={handleData}
                                />
                            </Form.Group>
                            <div className="text-danger">{register.error.logo}</div>
                            <div>
                                {register.logo && <img src={URL.createObjectURL(register.logo)} className="w-image mx-auto" alt="" />}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <Button variant="primary" type="submit" className="my-3">
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            </Container>
        </div>
    )
}