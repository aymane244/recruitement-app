import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function Dashboard() {
    const {admin, token, setAuth} = useContext(Auth);
    const [isLoading, setIsLoading] = useState(true)
    const [candidateTotal, setCandidateTotal] = useState([])
    const [candidateToday, setCandidateToday] = useState([])
    const [candidateLimit, setCandidateLimit] = useState([])
    const [recruiterTotal, setRecruiterTotal] = useState([])
    const [recruiterToday, setRecruiterToday] = useState([])
    const [recruiterLimit, setRecruiterLimit] = useState([])
    const [offerTotal, setOfferTotal] = useState([])
    const [offerToday, setOfferToday] = useState([])
    const [offerLimit, setOfferLimit] = useState([])
    setAuth(true);
    let i = 1;
    let j = 1;
    let a = 1;
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-allUsers/").then((res) => {
            setCandidateTotal(res.data.candidates);
            setCandidateToday(res.data.candidates_today);
            setRecruiterTotal(res.data.recruiters);
            setRecruiterToday(res.data.recruiters_today);
            setOfferTotal(res.data.offers);
            setOfferToday(res.data.offers_today);
            setCandidateLimit(res.data.candidates_limit);
            setRecruiterLimit(res.data.recruiters_limit);
            setOfferLimit(res.data.offers_limit);
            setIsLoading(false)
        });
    }, [])
    let image_admin;
    if(admin.image === null){
        image_admin = <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/>
    }else{
        image_admin = <img src={"http://127.0.0.1:8000/storage/"+admin.image} alt="profile" className="profile-img rounded-circle"/>
    }
    return (
        <div>
            {
                token ? 
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <div className="container">
                        <div className="my-4 d-flex justify-content-center align-items-center">
                            {image_admin} <h4 className="ms-3">Bienvenue sur votre profile <br/> {admin.first_name} {admin.last_name}</h4>
                        </div>
                        <div className="row justify-content-center my-2">
                            <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2">
                                <h3 className="text-center border-bottom pb-2">Total des candidats</h3>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Inscris aujourd'hui :</h4>
                                    <h4 className="text-cente">{candidateToday}</h4>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Total d'inscriptions :</h4>
                                    <h4 className="text-cente">{candidateTotal}</h4>
                                </div>
                            </div>
                            <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2 mx-4 position-relative">
                                <h3 className="text-center border-bottom pb-2">Total des entreprises</h3>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Inscris aujourd'hui :</h4>
                                    <h4 className="text-cente">{recruiterToday}</h4>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Total d'inscriptions :</h4>
                                    <h4 className="text-cente">{recruiterTotal}</h4>
                                </div>
                            </div>
                            <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2 mx-4 position-relative">
                                <h3 className="text-center border-bottom pb-2">Total des annonces </h3>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Posté aujourd'hui :</h4>
                                    <h4 className="text-cente">{offerToday}</h4>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <h4 className="text-cente">Total des annonces :</h4>
                                    <h4 className="text-cente">{offerTotal}</h4>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <h3 className="text-center">Liste des candidats</h3>
                                    {candidateLimit.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th>#</th>
                                                    <th>image</th>
                                                    <th>nom</th>
                                                    <th>prénom</th>
                                                    <th>email</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {candidateLimit.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {i++} </th>
                                                            <th> 
                                                                {list.photo === null ? 
                                                                    <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/> : 
                                                                    <img src={"http://127.0.0.1:8000/storage/"+list.photo} alt="profile" className="profile-img rounded-circle"/>
                                                                }
                                                            </th>
                                                            <th> {list.lname} </th>
                                                            <th> {list.fname} </th>
                                                            <th> {list.email} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de candidats pour le moment</h2>}
                                </div>
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste des entreprises</h3>
                                    {recruiterLimit.length > 0 ?
                                        <>
                                            <table className="table table-dark mt-3">
                                                <thead className="text-center">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>logo</th>
                                                        <th>Nom de l'entreprise</th>
                                                        <th>Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {recruiterLimit.map((list, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th> {j++} </th>
                                                                <th> <img src={"http://127.0.0.1:8000/storage/"+list.logo} alt="profile" className="profile-img rounded-circle"/> </th>
                                                                <th> {list.name} </th>
                                                                <th> {list.email} </th>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </> : <h2 className="text-center mt-5">Pas d'entreprise pour le moment</h2>}
                                </div>
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste des annonces</h3>
                                    {offerLimit.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Entreprise</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {offerLimit.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {a++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.name} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas d'annonce pour le moment</h2>
                                    }
                                </div>
                            </div>
                    </div>}
                </>
                : <Navigate to="/admin"/>
            }
        </div>
    )
}