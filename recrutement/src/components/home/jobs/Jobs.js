import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobSearch from "./JobSearch";
import Footer from "../pages/Footer";
import axios from "axios";
import { Auth } from "../../context/AuthContext";
import { Search } from "../../../App";

export default function Jobs() {
    const {tokenRe} = useContext(Auth)
    const {searchJob, jobs, searchCity} = useContext(Search)
    const [annonces, setAnnonce] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    let options = { year: 'numeric', month: 'long', day: 'numeric'};
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/jobs/").then((response) => {
            setAnnonce(response.data.annonces)
            setIsLoading(false)
        });
    }, [])
    return (
        <div>
            {tokenRe ? '' :
                <div className="border bg-white py-3 px-5 job-shadow">
                    <JobSearch/>
                </div>
            }
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <><div className="container mt-5 mb-5">
                    {annonces.length > 0 ?
                        <div className="row justify-content-center">
                            {(searchJob && searchCity) ?
                                (searchJob && searchCity) && jobs.filter((data) => data.job_position.toLowerCase().includes(searchJob.toLowerCase()) &&
                                    data.annonce_city.toLowerCase().includes(searchCity.toLowerCase()))
                                    .map((list, index) => {
                                        return (
                                            <>
                                                <div className="col-md-10 py-2" key={index}>
                                                    <div className="card text-bg-light mb-3 card-job w-100 h-100 position-relative">
                                                        <div className="card-header py-2 d-flex justify-content-between align-items-center">
                                                            <div className="border rounded card-job position-absolute img-position start-0 top-0">
                                                                <img src={"http://127.0.0.1:8000/storage/" + list.logo} className="logo-job" alt="company-logo" />
                                                            </div>
                                                            <div className="job-padding">
                                                                <h4>{list.job_position}</h4>
                                                                <h6><i className="fa-solid fa-location-dot"></i> {list.annonce_city}, {list.recruiter_country}</h6>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <Link to={"job-description/" + list.annonce_id} className="btn-save rounded text-decoration-none btn-apply">Voir offre</Link>
                                                            </div>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="d-flex job-padding">
                                                                <p className="me-4"> {list.name} </p>
                                                                <p className="mx-4"><i className="fa-regular fa-clock"></i>
                                                                    <span className="ms-2">Posté le : {new Date(list.created_at).toLocaleDateString("fr-FR", options)}</span>
                                                                </p>
                                                                <p><i class="fa-solid fa-pen-to-square"></i> Dernière mise à jour: {new Date(list.updated_at).toLocaleDateString("fr-FR", options)}</p>
                                                            </div>
                                                            <p className="card-text job-padding turncate text-justify wrap">{list.job_description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    }) :
                                annonces.map((list, index) => {
                                    return (
                                        <>
                                            <div className="col-md-10 py-2" key={index}>
                                                <div className="card text-bg-light mb-3 card-job w-100 h-100 position-relative">
                                                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                                                        <div className="border rounded card-job position-absolute img-position start-0 top-0">
                                                            <img src={"http://127.0.0.1:8000/storage/" + list.logo} className="logo-job" alt="company-logo" />
                                                        </div>
                                                        <div className="job-padding">
                                                            <h4>{list.job_position}</h4>
                                                            <h6><i className="fa-solid fa-location-dot"></i> {list.annonce_city}, {list.recruiter_country}</h6>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <Link to={"job-description/" + list.annonce_id} className="btn-save rounded text-decoration-none btn-apply">Voir l'offre</Link>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="d-flex job-padding">
                                                            <p className="me-4"> {list.name} </p>
                                                            <p className="mx-4"><i className="fa-regular fa-clock"></i>
                                                                <span className="ms-2">Posté le : {new Date(list.created_at).toLocaleDateString("fr-FR", options)}</span>
                                                            </p>
                                                            <p><i class="fa-solid fa-pen-to-square"></i> Dernière mise à jour: {new Date(list.updated_at).toLocaleDateString("fr-FR", options)}</p>
                                                        </div>
                                                        <p className="card-text job-padding turncate text-justify wrap">{list.job_description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                        : <h1 className="text-center margin-text">Pas des offres d'emploi dans nos base de données pour le moment</h1>}
                </div><Footer /></>}
        </div>
    )
}