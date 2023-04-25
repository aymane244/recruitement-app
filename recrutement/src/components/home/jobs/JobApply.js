import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../../context/AuthContext";
import Footer from "../pages/Footer";

export default function JobApply() {
    const {candidate, apiCandidate} = useContext(Auth)
    const [recruiter, setRecruiter] = useState([]);
    const [annonce, setAnnonce] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [resume, setResume] = useState([])
    const [lettre, setLetter] = useState([])
    const { id } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/job-description/" + id).then((response) => {
            setRecruiter(response.data.recruiter);
            setAnnonce(response.data.annonce);
            setIsLoading(false)
        });
    }, [])
    useEffect(() => {
        async function checkResume() {
            const candidates = await apiCandidate.get('/api/check-resume/');
            setResume(candidates.data.resume)
            setLetter(candidates.data.letter)
            setIsLoading(false)
        }
        checkResume()
    }, [])
    function sendApplication(event){
        event.preventDefault();
        const data = {
            candidate: candidate.id,
            annonce : annonce.id
        }
        axios.post("http://127.0.0.1:8000/api/send-application/", data).then(res => {
            if(res.data.status === 200){
                navigate("/jobs/job-description/"+id, { state: res.data.message });
            }
        })
    }
    console.log(recruiter)
    console.log(annonce)
    return (
        <div>
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <><div className="container mt-4">
                    <h5>
                        <Link to={"/jobs/job-description/" + id} className="text-decoration-none text-dark">
                            <i className="fa-solid fa-arrow-left"></i> Retour
                        </Link>
                    </h5>
                    <h3 className="text-center mt-4">Résume de votre candidature</h3>
                    <h3 className="text-center mt-5">Votre candidature</h3>
                    <div className="border rounded mt-4 mx-auto job-review px-3 py-2">
                        <div className="d-flex">
                            <div>
                                {recruiter.map(job => {
                                    return (
                                        <img src={"http://127.0.0.1:8000/storage/" + job.logo} className="logo-job" alt="company-logo" />
                                    );
                                })}
                            </div>
                            <div className="ms-4">
                                <h4>{annonce.job_position}</h4>
                                {recruiter.map((job, index) => {
                                    return (
                                        <h6> {job.recruiter === annonce.recruiter_id ? job.name : ''}  </h6>
                                    );
                                })}
                                <h6>
                                    <i className="fa-solid fa-location-dot"></i> {annonce.annonce_city},
                                    {recruiter.map((job, index) => {
                                        return (
                                            <span> {job.recruiter === annonce.recruiter_id ? job.recruiter_country : ''} </span>
                                        );
                                    })}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-center mt-5">Votre CV</h3>
                    <div className="border rounded mt-4 mx-auto job-review px-3 py-2">
                        <div className="d-flex align-items-center justify-content-between fs-5">
                            <div>
                                <i className="fa-solid fa-paperclip"></i> <span className="ms-2">{candidate.fname + ' ' + candidate.lname} cv</span>
                            </div>
                            <div>
                                <Link to="/candidate/CV" target="_blank"><i className="fa-solid fa-pen-to-square link-color"></i></Link>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-3 fs-5">
                            <div>
                                <i className="fa-solid fa-file"></i> <span className="ms-2">{candidate.fname + ' ' + candidate.lname} Lettre de motivation</span>
                            </div>
                            <div>
                                <Link to="/candidate/cover-letter" target="_blank"><i className="fa-solid fa-pen-to-square link-color"></i></Link>
                            </div>
                        </div>
                    </div>
                    {(resume.length > 0 && lettre.length > 0) ?
                        <form onSubmit={sendApplication}>
                            <div className="my-3 text-center">
                                <button type="submit" className="btn-save rounded text-decoration-none px-5 py-2">Postuler</button>
                            </div>
                        </form> : <div className="my-3 text-center"><button className="rounded btn-apply" disabled>Veuillez compléter votre profile</button></div>}
                </div><Footer /></>}
        </div>
    )
}