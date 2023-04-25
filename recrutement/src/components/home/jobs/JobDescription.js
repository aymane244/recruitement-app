import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../../context/AuthContext";
import Footer from "../pages/Footer";

export default function JobDescription() {
    const {candidate, apiCandidate, tokenCa, tokenRe} = useContext(Auth)
    const [isLoading, setIsLoading] = useState(true)
    const [recruiter, setRecruiter] = useState([]);
    const [annonce, setAnnonce] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [hardSkills, setHardSkills] = useState([]);
    const [language, setLanguage] = useState([]);
    const [save, setSave] = useState([]);
    const [application, setApplication] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/job-description/" + id).then((response) => {
            setRecruiter(response.data.recruiter);
            setAnnonce(response.data.annonce);
            setSoftSkills(response.data.softskills);
            setHardSkills(response.data.hardskills);
            setLanguage(response.data.languages);
            setIsLoading(false)
        });
    }, [id])
    useEffect(() => {
        async function getSavedOffres() {
            const saved = await apiCandidate.get('/api/get-saved-offers/' + id);
            setSave(saved.data.saves)
            setIsLoading(false)
        }
        getSavedOffres()
    }, [id])
    useEffect(() => {
        async function getCandidate() {
            const candidates = await apiCandidate.get('/api/check-application/'+ id);
            setApplication(candidates.data.applications)
            setIsLoading(false)
        }
        getCandidate()
    }, [])
    function saveOffre(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("candidat_id", candidate.id);
        data.append("id", id);
        axios.post("http://127.0.0.1:8000/api/save-offre", data).then(response => {
            navigate('/jobs/job-description/'+id, { state: response.data.message });
            navigate(0)
        })
    }
    console.log(recruiter)
    return (
        <div>
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <><div className="container mt-3">
                    <div>
                        <Link to="/">Home</Link> / <Link to="/jobs">Jobs</Link> / {annonce.job_position}
                    </div>
                </div><hr />
                <div className="container">
                    {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4>{annonce.job_position}</h4>
                                <div className="d-flex mt-3">
                                    {recruiter.map((job, index) => {
                                        return (
                                            <h6> {job.name} </h6>
                                        );
                                    })}
                                    <h6 className="mx-3"><i className="fa-solid fa-location-dot"></i> {annonce.annonce_city},
                                        {recruiter.map((job, index) => {
                                            return (
                                                <span> {job.recruiter_country} </span>
                                            );
                                        })}
                                    </h6>
                                </div>
                                <div className="d-flex mt-2">
                                    <p><i className="fa-solid fa-file-signature"></i> Contrat: {annonce.contract} </p>
                                    <p className="mx-3"><i class="fa-solid fa-user-tie"></i> N° de Poste: {annonce.position} </p>
                                    <p><i class="fa-solid fa-tag"></i> Salaire: {annonce.salary} Dhs</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                {save.length >= 1 ? <button className="rounded btn-apply" disabled>Sauvgardé</button> : !tokenCa ? '' : application.length > 0 ?
                                    <button className="rounded btn-apply" disabled>Déjà postuler</button> :
                                    <form onSubmit={saveOffre}>
                                        <button className="btn-save px-3 py-2 rounded">Sauvegarder</button>
                                    </form>
                                }
                            
                                {application.length > 0 ? 
                                    <button className="rounded btn-apply" disabled>Déjà Postuler</button> : tokenCa ?
                                    <Link to="job-apply" className="btn-save rounded text-decoration-none btn-apply px-3 py-2">Postuler</Link> : tokenRe ? '' : 
                                    <h5>Vous devez se connecter avant de postuler <br/> <a href="/login">Par ici</a></h5>
                                }
                            </div>
                        </div>
                    </div>
            <hr/>
            <div className="container">
                <h4 className="pb-3"> Compétences </h4>
                <p><i className="fa-sharp fa-solid fa-user-tie"></i> Expérience: 
                    {annonce.experience === "Debutant" ? " une première expérience est souhaitable" : 
                    annonce.experience === "Intermediaire" ? " Entre 2 ans et 4 ans": 
                    annonce.experience === "Expert" ? " Plus de 5 ans" : ''} 
                </p>        
                    <p><i className="fa-solid fa-book"></i> Compténces techniques: 
                        {hardSkills.map((skill, index) => {
                            return ( 
                                <span className="ms-2">{skill.hardskills + ","}  </span>
                            );
                        })}
                    </p>
                <p><i className="fa-solid fa-book"></i> Compténces personnelles: 
                    {softSkills.map((skill, index) => {
                        return ( 
                            <span className="ms-2">{skill.softskills + ","}  </span>
                        );
                    })}
                </p>
                <p><i className="fa-solid fa-book"></i> Langues maitrisé: 
                    {language.map((lang, index) => {
                        return ( 
                            <span className="ms-2">
                                {lang.language + " "+"(Lu: "+ (lang.read === "Avance" ? "Avancé" : lang.read === "Debutant" ? "Débutant" : lang.read === "Intermediaire" ? "Intermédiaire" : "") + 
                                    ', Parlé: ' + (lang.spoken === "Avance" ? "Avancé" : lang.spoken === "Debutant" ? "Débutant" : lang.spoken === "Intermediaire" ? "Intermédiaire" : "") + 
                                    ", Ecrit: " + (lang.written === "Avance" ? "Avancé" : lang.written === "Debutant" ? "Débutant" : lang.written === "Intermediaire" ? "Intermédiaire" : "") + ",)" + ","}  
                            </span>
                        );
                    })}
                </p>
            </div>
            <hr/>
            <div className="container pb-3">
                <h4 className="mb-3">Déscription du poste</h4>
                <h6 className="pb-3 text-justify text-spacing wrap"> {annonce.job_description} </h6>
            </div>
            <hr/>
            {/* <div className="pb-5 text-center mt-4">
                {application.length > 0 ? 
                    <button className="rounded btn-apply" disabled>Déjà Postuler</button> : tokenCa ?
                    <Link to="job-apply" className="btn-save rounded text-decoration-none btn-apply fs-4">Postuler</Link> : tokenRe ? '' : 
                    <h5>Vous devez se connecter avant de postuler <br/> <a href="/login">Par ici</a></h5>
                }
            </div> */}
            <Footer/></>}
        </div>
    )
}