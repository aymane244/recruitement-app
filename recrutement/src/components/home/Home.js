import React, { useContext, useEffect } from "react";
import Hero from "./pages/Hero";
import Body from "./pages/Body";
import Footer from "./pages/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "../../App";

export default function Home(){
    const {searchJob, jobs,  searchCity, setCities, setJobs} = useContext(Search)
    let options = { year: 'numeric', month: 'long', day: 'numeric'};
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/jobs").then((response) => {
            setJobs(response.data.annonces);
            setCities(response.data.cities);
        });
    }, [])
    return(
        <div>
            <Hero/>
            {
                (searchJob && searchCity) ?  
                <>
                    <div className="container mt-5 mb-5">
                        <div className="row justify-content-center">
                            {(searchJob && searchCity) && jobs.filter((data)=>data.job_position.toLowerCase().startsWith(searchJob.toLowerCase()) && 
                            data.annonce_city.toLowerCase().startsWith(searchCity.toLowerCase()))
                            .map((list, index)=>{
                                return (
                                    <>
                                        {(searchJob.toLowerCase() === list.job_position.toLowerCase()) || (searchJob.includes(list.job_position.toLowerCase()) === list.job_position.includes(searchJob.toLowerCase())) ? 
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
                                                        <Link to={"jobs/job-description/" + list.annonce_id} className="btn-save rounded text-decoration-none btn-apply">Voir l'offre</Link>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex job-padding">
                                                        <p className="me-4"> {list.name} </p>
                                                        <p><i class="fa-solid fa-briefcase"></i>
                                                            <span className="ms-2">{list.contract}</span>
                                                        </p>
                                                        <p className="mx-4"><i className="fa-regular fa-clock"></i>
                                                            <span className="ms-2">Posté le : {new Date(list.created_at).toLocaleDateString("fr-FR", options)}</span>
                                                        </p>
                                                        <p><i class="fa-solid fa-pen-to-square"></i> Dernière mise à jour: {new Date(list.updated_at).toLocaleDateString("fr-FR", options)}</p>
                                                    </div>
                                                    <p className="card-text job-padding turncate text-justify">{list.job_description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        : (searchJob.toLowerCase() === list.job_position.toLowerCase()) ? 'no' : ''}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </>:
                <Body />
            }
            <Footer/>
        </div>
    )
}