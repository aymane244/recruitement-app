import axios from "axios";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";
import { Button, Modal } from "react-bootstrap";
import CandidateCV from "./CandidateCV";

export default function RecommandedCandidates(){
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();
    const navigate = useNavigate();
    const {recruiter, api, tokenRe} = useContext(Auth)
    const [candidate, setCandidate] = useState([])
    const [annonces, setAnnonce] = useState([])
    const [candidatId, setCandidatId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalcv, setShowModalcv] = useState(false);
    const [interview, setInterview] = useState({
        date_interview : '',
        time_interview : '',
        annonces_interview : '',
    })
    console.log(candidate)
    const refCandidate = useRef(null)
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/recommanded-candidate").then((response) => {
            setCandidate(response.data.candidat);
            setIsLoading(false)
        });
    }, [])
    useEffect(() => {
        async function getAnnoncesInterview() {
            const annonces_interview = await api.get('/api/annonces');
            setAnnonce(annonces_interview.data.annonces)
            setIsLoading(false)
        }
        getAnnoncesInterview()
    }, [])
    function handleData(event){
        setInterview(formData =>({
            ...formData,
            [event.target.name] : event.target.value
        }))
    }
    function toggleModal(cand_id){
        setCandidatId(cand_id)
        setShowModal(!showModal);
    }
    function toggleModalCV(id){
        setCandidatId(id)
        setShowModalcv(!showModalcv);
    }
    function sendInvitation(e){
        e.preventDefault();
        const data = new FormData();
        data.append("date_interview", interview.date_interview);
        data.append("time_interview", interview.time_interview);
        data.append("candidat_id", candidatId);
        data.append("annonce_id", interview.annonces_interview);
        axios.post("http://127.0.0.1:8000/api/send-Interviewinvitation", data).then(response => {
            navigate("/recruiter/recommended", { state: response.data.message });
            navigate(0);
        })
    }
    return(
        <div className="container my-5">
            {tokenRe ? 
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <><div className="row">
                            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                            {candidate.length > 0 ? candidate.map((list, index) => {
                                return (
                                    <div className="col-md-4">
                                        <div class="card text-center mb-3 shadow" style={{ width: "18rem" }}>
                                            <div class="card-body">
                                                <h5 class="card-title">
                                                    {list.photo === null ? <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle" /> :
                                                        <img src={"http://127.0.0.1:8000/storage/" + list.photo} alt="profile" className="profile-img rounded-circle" />}
                                                </h5>
                                                <h6>
                                                    <i class="fa-solid fa-user"></i> {list.fname + ' ' + list.lname}<hr />
                                                    <span>
                                                        <i class="fa-solid fa-user-tie"></i> {list.profil}
                                                        <button 
                                                            className="bg-transparent border-0 text-primary"
                                                            onClick={() => toggleModalCV(list.candidat)}
                                                        ><u>CV</u>
                                                        </button>
                                                    </span>
                                                    <hr />
                                                    <i class="fa-solid fa-envelope"></i> {list.candidat_email}<hr />
                                                    <i class="fa-solid fa-phone"></i> {list.phone}<hr />
                                                    <i class="fa-solid fa-location-pin"></i> {list.candidate_city}<hr />
                                                    <i class="fa-solid fa-briefcase"></i> Recommandé par : {list.recruiter === recruiter.id ? 'Vous même' : list.name}<hr />
                                                    <span className="fa-solid fa-star" style={list.rating >= 1 ? { color: 'orange' } : { color: '' }}></span>
                                                    <span className="fa-solid fa-star" style={list.rating >= 2 ? { color: 'orange' } : { color: '' }}></span>
                                                    <span className="fa-solid fa-star" style={list.rating >= 3 ? { color: 'orange' } : { color: '' }}></span>
                                                    <span className="fa-solid fa-star" style={list.rating >= 4 ? { color: 'orange' } : { color: '' }}></span>
                                                    <span className="fa-solid fa-star" style={list.rating >= 5 ? { color: 'orange' } : { color: '' }}></span>
                                                </h6>
                                                <p class="card-text">{list.comment}</p>
                                                <Button variant="primary" onClick={() => toggleModal(list.candidat)}>
                                                    Envoyer une demande d'entretien
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : <h2 className="text-center mt-5 pt-5">Pas des candidats recommandés pour le moment pour le moment</h2>}
                        </div>
                            <Modal show={showModal} onHide={toggleModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Demande d'entretien</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form onSubmit={sendInvitation}>
                                            <div>
                                                {candidatId && 
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12">
                                                            <h4 className="text-center my-3">Invitation pour une entretien</h4>
                                                        </div>
                                                        <div className="col-md-10 mb-3">
                                                            <select
                                                                name="annonces_interview"
                                                                class="form-select"
                                                                aria-label="Default select example"
                                                                onChange={handleData}
                                                                value={interview.date_interview}
                                                            >
                                                                <option value="">Choisir l'offre d'emploi</option>
                                                                {annonces.map((list, index) => {
                                                                    return (
                                                                        <option
                                                                            value={list.id}
                                                                        >{list.job_position}</option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <input
                                                                type="date"
                                                                name="date_interview"
                                                                className="form-control"
                                                                onChange={handleData}
                                                                value={interview.date_interview} />
                                                        </div>
                                                        <div className="col-md-5 mb-3">
                                                            <select className="form-select"
                                                                name="time_interview"
                                                                aria-label="Default select example"
                                                                onChange={handleData}
                                                                value={interview.time_interview}
                                                            >
                                                                <option value="">Choisir le temps</option>
                                                                <option value="10:00">A partir de 10:00</option>
                                                                <option value="11:00">A partir de 11:00</option>
                                                                <option value="12:00">A partir de 12:00</option>
                                                                <option value="14:00">A partir de 14:00</option>
                                                                <option value="15:00">A partir de 15:00</option>
                                                                <option value="16:00">A partir de 16:00</option>
                                                            </select>
                                                        </div>
                                                    </div>}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="btn btn-primary">Envoyer</button>
                                                <Button variant="secondary" onClick={toggleModal}>
                                                    Fermer
                                                </Button>
                                            </div>
                                        </form>
                                    </Modal.Body>
                                </Modal>
                                <Modal show={showModalcv} onHide={toggleModalCV}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>CV</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {candidatId && 
                                            <CandidateCV
                                                id={candidatId}
                                            />
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={toggleModalCV}>
                                            Fermer
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                        </>}
                </> :
                <Navigate to="/login"/>
            }
        </div>
    )
}