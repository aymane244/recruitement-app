import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterCandidate() {
    let navigate = useNavigate();
    const [candidate, setCandidate] = useState({
        fname: '',
        lname: '',
        email: '',
        candidate_adress: '',
        cin: '',
        gender: '',
        birthday: '',
        phone: '',
        photo: '',
        candidate_city: '',
        password: '',
        password_confirmation: '',
        error: [],
    })
    function handleData(e) {
        const { name, files, value, type } = e.target;
        setCandidate(formData => ({
            ...formData,
            [name]: type === "file" ? files[0] : value
        }))
    }
    function sendData(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("fname", candidate.fname);
        data.append("lname", candidate.lname);
        data.append("email", candidate.email);
        data.append("cin", candidate.cin);
        data.append("candidate_adress", candidate.candidate_adress);
        data.append("gender", candidate.gender);
        data.append("birthday", candidate.birthday);
        data.append("phone", candidate.phone);
        data.append("candidate_city", candidate.candidate_city);
        data.append("photo", candidate.photo);
        data.append("password", candidate.password);
        data.append("password_confirmation", candidate.password_confirmation);
        axios.post("http://127.0.0.1:8000/api/add-candidate", data).then(response => {
            if (response.data.status === 200) {
                setCandidate({
                    fname: '',
                    lname: '',
                    email: '',
                    cin: '',
                    gender: '',
                    phone: '',
                    candidate_city: '',
                    candidate_adress: '',
                    photo: '',
                    password: '',
                    password_confirmation: '',
                    error: []
                })
                navigate('/login', { state: response.data.message })
            } else if (response.data.status === 400) {
                setCandidate(errors => ({
                    ...errors,
                    error: response.data.message_errors,
                }))
            }
        })
    }
    return (
        <div className="container my-5">
            <Link to='/login'><i className="fa-solid fa-arrow-left arrow-style text-dark"></i></Link>
            <h1 className="text-center mt-5">Inscription</h1>
            <form onSubmit={sendData} encType="multipart/form-data">
                <div className="row mt-5">
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="text"
                            name="fname"
                            className="form-control"
                            id="floatingPrenom"
                            placeholder="Prénom"
                            onChange={handleData}
                            value={candidate.fname}
                        />
                        <label htmlFor="floatingPrenom" className="ps-4">Prénom</label>
                        <div className="text-danger">{candidate.error.fname}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="text"
                            name="lname"
                            className="form-control"
                            id="floatingNom"
                            placeholder="Prénom"
                            onChange={handleData}
                            value={candidate.lname}
                        />
                        <label htmlFor="floatingNom" className="ps-4">Nom</label>
                        <div className="text-danger">{candidate.error.lname}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="floatingEmail"
                            placeholder="email@email.com"
                            onChange={handleData}
                            value={candidate.email}
                        />
                        <label htmlFor="floatingEmail" className="ps-4">Email</label>
                        <div className="text-danger">{candidate.error.email}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="text"
                            name="cin"
                            className="form-control"
                            id="floatingCIN"
                            placeholder="cin"
                            onChange={handleData}
                            value={candidate.cin}
                        />
                        <label htmlFor="floatingCIN" className="ps-4">N° de CIN</label>
                        <div className="text-danger">{candidate.error.cin}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-4">
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            id="floatingPhone"
                            placeholder="phone"
                            onChange={handleData}
                            value={candidate.phone}
                        />
                        <label htmlFor="floatingPhone" className="ps-4">N° de téléphone</label>
                        <div className="text-danger">{candidate.error.phone}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-4">
                        <input
                            type="date"
                            name="birthday"
                            className="form-control"
                            id="floatingBirthday"
                            onChange={handleData}
                            value={candidate.birthday}
                        />
                        <label htmlFor="floatingBirthday" className="ps-4">Date de naissance</label>
                        <div className="text-danger">{candidate.error.birthday}</div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select padding-input text-center"
                            aria-label=".form-select-lg example"
                            name="gender"
                            onChange={handleData}
                            value={candidate.gender}
                        >
                            <option value="">---- Veuillez choisir votre sexe ----</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                        </select>
                        <div className="text-danger">{candidate.error.gender}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="text"
                            name="candidate_city"
                            className="form-control"
                            id="floatingCity"
                            placeholder="ville"
                            onChange={handleData}
                            value={candidate.candidate_city}
                        />
                        <label htmlFor="floatingCity" className="ps-4">Ville</label>
                        <div className="text-danger">{candidate.error.candidate_city}</div>
                    </div>
                    <div className="form-floating mb-3 col-md-6">
                        <input
                            type="text"
                            name="candidate_adress"
                            className="form-control"
                            id="floatingAdress"
                            placeholder="adresse"
                            onChange={handleData}
                            value={candidate.candidate_adress}
                        />
                        <label htmlFor="floatingAdress" className="ps-4">Adresse</label>
                        <div className="text-danger">{candidate.error.candidate_adress}</div>
                    </div>
                    <div className="form-floating col-md-6">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            onChange={handleData}
                            value={candidate.password}
                        />
                        <label htmlFor="floatingPassword" className="ps-4">Mot de passe</label>
                        <div className="text-danger">{candidate.error.password}</div>
                    </div>
                    <div className="form-floating col-md-6">
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            id="floatingPasswordConfirmation"
                            placeholder="Password"
                            onChange={handleData}
                            value={candidate.password_confirmation}
                        />
                        <label htmlFor="floatingPasswordConfirmation" className="ps-4">Confirmer votre mot de passe</label>
                        <div className="text-danger">{candidate.error.password_confirmation}</div>
                    </div>
                    <div className="input-group mt-3 w-50">
                        <label className="input-group-text " htmlFor="inputGroupFile01">Photo de profile</label>
                        <input
                            type="file"
                            name="photo"
                            className="form-control"
                            id="inputGroupFile01"
                            onChange={handleData}
                        />
                    </div>
                    <div className="text-danger">{candidate.error.photo}</div>
                    <div className="mt-3 text-center">
                        {candidate.photo && <img src={URL.createObjectURL(candidate.photo)} className="w-image mx-auto" alt="" />}
                    </div>
                    <div className="col-md-12 text-center my-4">
                        <button className="btn btn-primary px-5 py-2 fs-5">Inscription</button>
                    </div>
                </div>
            </form>
        </div>
    )
}