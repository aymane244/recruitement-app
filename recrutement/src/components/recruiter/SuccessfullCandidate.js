import axios from "axios";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";
import { Button, Modal } from "react-bootstrap";

export default function SuccessefullCandidate(){
    const [isLoading, setIsLoading] = useState(true)
    const {recruiter,  api, tokenRe } = useContext(Auth)
    const location = useLocation();
    const navigate = useNavigate();
    const [candidatId, setCandidatId] = useState(null);
    const [annonceId, setAnnonceId] = useState(null);
    const [showModalInterview, setShowModalInterview] = useState(false)
    const [showModalRecommandation, setShowModalRecommandation] = useState(false)
    const [annonce, setAnnonce] = useState([]);
    const [colorStar1, setColorStar1] = useState(false);
    const [colorStar2, setColorStar2] = useState(false);
    const [colorStar3, setColorStar3] = useState(false);
    const [colorStar4, setColorStar4] = useState(false);
    const [colorStar5, setColorStar5] = useState(false);
    const [interview, setInterview] = useState({
        date_interview : '',
        time_interview : ''
    })
    const [recommandText, setRecomandText] = useState('')
    const [recommended, setRecommende] = useState([]);
    let refRatings = useRef(0)
    useEffect(() => {
        async function getResume() {
            const app = await api.get('/api/get-applications');
            setAnnonce(app.data.applications)
            setIsLoading(false)
        }
        getResume()
    }, [recruiter.id])
    function toggleModalRecommandatio(candidat_id, annonce_id){
        setCandidatId(candidat_id)
        setAnnonceId(annonce_id)
        setShowModalRecommandation(!showModalRecommandation);
    }
    function toggleModalInterview(candidat_id, annonce_id){
        setCandidatId(candidat_id)
        setAnnonceId(annonce_id)
        setShowModalInterview(!showModalInterview); 
    }
    function handleData(event){
        setInterview(formData =>({
            ...formData,
            [event.target.name] : event.target.value
        }))
    }
    function sendInvitation(e){
        e.preventDefault();
        const data = new FormData();
        data.append("date_interview", interview.date_interview);
        data.append("time_interview", interview.time_interview);
        data.append("candidat_id", candidatId);
        data.append("annonce_id", annonceId);
        axios.post("http://127.0.0.1:8000/api/send-invitation", data).then(response => {
            navigate("/recruiter/candidates", { state: response.data.message });
            navigate(0);
        })
    }
    function handleRecommandation(event){
        setRecomandText(event.target.value)
    }
    function rating(event){
        if(parseInt(event.target.id) === 1){
            setColorStar1(starColor => !starColor)
            if(colorStar1 === true && colorStar2 === true && colorStar3 === true && colorStar4 === true && colorStar5 === true){
                setColorStar1(true)
                setColorStar2(false)
                setColorStar3(false)
                setColorStar4(false)
                setColorStar5(false)
            }else if(colorStar1 === true && colorStar2 === true && colorStar3 === true && colorStar4 === true){
                setColorStar1(true)
                setColorStar2(false)
                setColorStar3(false)
                setColorStar4(false)
            }
            else if(colorStar1 === true && colorStar2 === true && colorStar3 === true){
                setColorStar1(true)
                setColorStar2(false)
                setColorStar3(false)
            }
            else if(colorStar1 === true && colorStar2 === true){
                setColorStar1(true)
                setColorStar2(false)
            }
            if(colorStar1 === true && colorStar2 === true && colorStar3 === true && colorStar4 === true && colorStar5 === true){
                refRatings.current = 1
            }else{
                refRatings.current = 0
            }
        }else if(parseInt(event.target.id) === 2){
            refRatings.current = 2
            setColorStar1(true)
            setColorStar2(starColor => !starColor)
            if(colorStar2 === true && colorStar3 === true && colorStar4 === true && colorStar5 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(false)
                setColorStar4(false)
                setColorStar5(false)
            }else if(colorStar2 === true && colorStar3 === true && colorStar4 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(false)
                setColorStar4(false)
            }else if(colorStar2 === true && colorStar3 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(false)
            }else if(colorStar2 === true && colorStar3 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(false)
            }
        }else if(parseInt(event.target.id) === 3){
            refRatings.current = 3
            setColorStar1(true)
            setColorStar2(true)
            setColorStar3(starColor => !starColor)
            if(colorStar3 === true && colorStar4 === true && colorStar5 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(true)
                setColorStar4(false)
                setColorStar5(false)
            }else if(colorStar3 === true && colorStar4 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(true)
                setColorStar4(false)
            }
        }else if(parseInt(event.target.id) === 4){
            refRatings.current = 4
            setColorStar1(true)
            setColorStar2(true)
            setColorStar3(true)
            setColorStar4(starColor => !starColor)
            if(colorStar4 === true && colorStar5 === true){
                setColorStar1(true)
                setColorStar2(true)
                setColorStar3(true)
                setColorStar4(true)
                setColorStar5(false)
            }
        }else if(parseInt(event.target.id) === 5){
            refRatings.current = 5
            setColorStar1(true)
            setColorStar2(true)
            setColorStar3(true)
            setColorStar4(true)
            setColorStar5(starColor => !starColor)
        }
    }
    function sendRating(event){
        event.preventDefault();
        const data = new FormData();
        data.append("recruiter_id", recruiter.id);
        data.append("rating", refRatings.current);
        data.append("candidat_id", candidatId);
        data.append("comments", recommandText);
        axios.post("http://127.0.0.1:8000/api/recommande/", data).then(response => {
            navigate("/recruiter/candidates", { state: response.data.message });
            navigate(0);
        })
    }
    useEffect(() => {
        async function getRecomendedCandidates() {
            const recommanded = await api.get('/api/recommended');
            setRecommende(recommanded.data.recommandation)
            setIsLoading(false)
        }
        getRecomendedCandidates()
    }, [])
    let i = 1;
    console.log(annonce)
    return(
        <div className="container mt-5">
            {tokenRe ? 
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> : 
                    <><div>
                            <h2 className="my-3 text-center">Candidats réussies</h2>
                            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                            {annonce.length > 0 ?
                                <table className="table table-dark">
                                    <thead className="text-center">
                                        <tr>
                                            <th>#</th>
                                            <th>Annonces</th>
                                            <th>Candidats</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {annonce.map((list, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th> {i++} </th>
                                                    <th> {list.job_position} </th>
                                                    <th> {list.fname + ' ' + list.lname} </th>
                                                    <th>
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-6">
                                                                <Button variant="primary" onClick={() => toggleModalInterview(list.candidate_id, list.annonce_id)}>
                                                                    Demande d'entretien
                                                                </Button>
                                                            </div>
                                                            <div className="col-md-6">
                                                                {recommended.length > 0 ? 
                                                                    recommended.map((value, key)=>{
                                                                        return(
                                                                            <div>
                                                                                {value.candidate_id === list.candidate_id ? <button className="btn btn-primary" disabled> Candidat recommandé</button> :
                                                                                <Button variant="primary" onClick={() => toggleModalRecommandatio(list.candidate_id, list.annonce_id)}>
                                                                                    Recommander
                                                                                </Button>}
                                                                            </div> 
                                                                    )
                                                                })
                                                                : <Button variant="primary" onClick={() => toggleModalRecommandatio(list.candidate_id, list.annonce_id)}>
                                                                        Recommander
                                                                    </Button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table> : <h2 className="text-center mt-5 pt-5">Pas des candidats réussis pour le moment pour le moment</h2>}
                            </div>
                            <Modal show={showModalRecommandation} onHide={toggleModalRecommandatio}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Recommandation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <form onSubmit={sendRating}>
                                            <div>
                                                {(candidatId && annonceId)&&
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-12">
                                                            {annonce.map((list, index) => {
                                                                return (
                                                                    <h4 className="text-center my-3">
                                                                        Recommander {list.candidate_id === candidatId ? list.fname + ' ' + list.lname : ''}
                                                                    </h4>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="col-md-10 mb-3 fs-4">
                                                            <div className="d-flex justify-content-around">
                                                                <i
                                                                    className="fa-solid fa-star star-hover"
                                                                    id="1"
                                                                    onClick={rating}
                                                                    style={colorStar1 ? { color: "orange" } : { color: '' }}
                                                                >
                                                                </i>
                                                                <i
                                                                    className="fa-solid fa-star star-hover"
                                                                    id="2"
                                                                    onClick={rating}
                                                                    style={colorStar2 ? { color: "orange" } : { color: '' }}
                                                                >
                                                                </i>
                                                                <i
                                                                    className="fa-solid fa-star star-hover"
                                                                    id="3"
                                                                    onClick={rating}
                                                                    style={colorStar3 ? { color: "orange" } : { color: '' }}
                                                                >
                                                                </i>
                                                                <i
                                                                    className="fa-solid fa-star star-hover"
                                                                    id="4"
                                                                    onClick={rating}
                                                                    style={colorStar4 ? { color: "orange" } : { color: '' }}
                                                                >
                                                                </i>
                                                                <i
                                                                    className="fa-solid fa-star star-hover"
                                                                    id="5"
                                                                    onClick={rating}
                                                                    style={colorStar5 ? { color: "orange" } : { color: '' }}
                                                                >
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10 mb-3">
                                                            <textarea
                                                                name="recommandText"
                                                                className="form-control"
                                                                rows={7}
                                                                onChange={handleRecommandation}
                                                                value={recommandText}
                                                            >
                                                            </textarea>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="btn btn-primary">Envoyer</button>
                                                <Button variant="secondary" onClick={toggleModalRecommandatio}>
                                                    Fermer
                                                </Button>
                                            </div>
                                        </form>
                                </Modal.Body>
                            </Modal>
                            <Modal show={showModalInterview} onHide={toggleModalInterview}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Entretien</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body> 
                                        <form onSubmit={sendInvitation}>
                                            <div className="modal-body">
                                                {(candidatId && annonceId) &&
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h4 className="text-center my-3">Choisir la date d'entretien</h4>
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
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={toggleModalInterview}>Fermer</button>
                                            </div>
                                        </form>
                                        
                                    </Modal.Body>
                                </Modal>
                        </>}
                </> :
                <Navigate to="/login"/>
            }
        </div>
    )
}
