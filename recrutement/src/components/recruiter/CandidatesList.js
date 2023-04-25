import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";
import CandidateCV from "./CandidateCV";
// import './modal.css';

export default function CandidatesList(){
    const [isLoading, setIsLoading] = useState(true)
    const { api, tokenRe } = useContext(Auth)
    let navigate = useNavigate();
    const location = useLocation();
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [candidate, setCandidate] = useState([]);
    const [annonce, setAnnonce] = useState([]);
    const [softskills, setSoftSkills] = useState([]);
    const [softskillsannonce, setSoftSkillsAnnonce] = useState([]);
    const [hardskills, setHardSkills] = useState([]);
    const [hardskillsannonce, setHardSkillsAnnonce] = useState([]);
    const [language, setLanguage] = useState([]);
    const [languageannonce, setLanguageAnnonce] = useState([]);
    const [experience, setExperience] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedExperience, setSelectedExpeirience] = useState([]);
    const [selectedSoftskills, setSelectedSoftSkills] = useState([]);
    const [selectedHardskills, setSelectedHardSkills] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [name, setName] = useState([]);
    const [cadId, setCadId] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [checkQuiz, setCheckQuiz] = useState([]);
    const [passedQuiz, setPassedQuiz] = useState([]);
    const [yearsExperince, setYearsExperience] = useState([]);
    const [filtrage, setFiltrage] = useState({
        filter : '',
    });
    const { id } = useParams();
    useEffect(() => {
        async function getApplication() {
            const app = await api.get('/api/show-applications/' + id);
            setCandidate(app.data.candidate)
            setSoftSkills(app.data.sofskills)
            setHardSkills(app.data.hardskills)
            setLanguage(app.data.language)
            setExperience(app.data.experience)
            setName(app.data.app_name)
            setCadId(app.data.id)
            setSelectedCandidate(app.data.selected)
            setCheckQuiz(app.data.quiz)
            setPassedQuiz(app.data.passed)
            setYearsExperience(app.data.years)
            setIsLoading(false)
        }
        getApplication()
    }, [id])
    console.log(yearsExperince)
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/job-description/" + id).then((response) => {
            setAnnonce(response.data.annonce);
            setSoftSkillsAnnonce(response.data.softskills);
            setHardSkillsAnnonce(response.data.hardskills);
            setLanguageAnnonce(response.data.languages);
            setIsLoading(false)
        });
    }, [id])
    function handleData(e){
        setFiltrage(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    function sendData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("filter", filtrage.filter);
        data.append("candidat_id", JSON.stringify(cadId));
        data.append("id", id)
        axios.post("http://127.0.0.1:8000/api/filtrer", data).then(response => {
            setSelected(response.data.selected)
            navigate("/recruiter/candidats-annonces/"+id, { state: response.data.message });
            navigate(0);
        })
    }
    useEffect(() => {
        async function getSelected() {
            const candidate_selected = await api.get('/api/show-selected/' + id);
            setSelected(candidate_selected.data.selected)
            setSelectedExpeirience(candidate_selected.data.expereince)
            setSelectedSoftSkills(candidate_selected.data.softskills)
            setSelectedHardSkills(candidate_selected.data.hardskills)
            setSelectedLanguage(candidate_selected.data.langauge)
            setQuiz(candidate_selected.data.quiz)
            setIsLoading(false)
        }
        getSelected()
    }, [id])
    console.log(quiz);
    function sendTest(e){
        e.preventDefault();
        const data = new FormData();
        data.append("candidat_id", JSON.stringify(selected));
        for(let i = 0; i < quiz.length; i++){
            data.append("quiz", quiz[i].id);
        }
        axios.post("http://127.0.0.1:8000/api/sendTest", data).then(response => {
            setSelected(response.data.selected)
            navigate("/recruiter/candidats-annonces/"+id, { state: response.data.message });
            navigate(0);
        })
    }
    function toggleModal(cand_id){
        setSelectedId(cand_id)
        setShowModal(!showModal);
    }
    const type = selectedCandidate.length > 0 && selectedCandidate.map((filtre)=>{
        return(
            <h2 className="text-center">
                Type de filtrage : 
                {
                    filtre.filtring_type === "all" ? " Filtrage complet" : 
                    filtre.filtring_type === "no_experience" ? " Filtrage sans expérience" : 
                    filtre.filtring_type === "no_softskill" ? " Filtrage sans compétences personelles" :
                    filtre.filtring_type === "no_hardskill" ? " Filtrage sans compétences techniques" :
                    filtre.filtring_type === "no_language" ? " Filtrage sans compétences linguistiques" :
                    filtre.filtring_type === "no_levels" ? " Filtrage sans les niveaux linguistiques" :
                    filtre.filtring_type === "not_all" ? " Aucun filtrage accordé" : ""
                }
            </h2>
        )
    })
    return(
        <div className="container mt-5">
            {tokenRe ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <div className="row">
                            <div className="col-md-12">
                                {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                                <div className="border-bottom mb-3">
                                    <div className="ps-3 row">
                                        <h4>- Les caractérstiques de l'annonce </h4>
                                        <h5 className="ps-4 mb-5">Vous avez besoin d'un candidat qui possède les qualités suivantes</h5>
                                        <div className="col-md-3">
                                            <p className="text-center border-bottom pb-2"><strong>Niveau d'expérience</strong></p>
                                            {annonce.experience && 
                                            <ul>
                                                <li>{annonce.experience === "Debutant" ? "Débutant" : annonce.experience === "Intermediaire" ?
                                                    "Intermédiaire" : annonce.experience === "Expert" ? "Expert" : ""} <br/> 
                                                    {annonce.experience === "Debutant" ? " une première expérience est souhaitable" : 
                                                    annonce.experience === "Intermediaire" ? " Soit une expérience entre Entre 2 ans et 4 ans": 
                                                    annonce.experience === "Expert" ? " Soit une expérience entre Plus de 5 ans" : ''} 
                                                </li>
                                            </ul>
                                            }
                                        </div>
                                        <div className="col-md-2">
                                            <p className="text-center border-bottom pb-2"><strong>Compétences</strong></p>
                                            <ul>
                                                {hardskillsannonce.map((skill, index) => {
                                                    return ( 
                                                        <li>{skill.hardskills + ","}  </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="text-center border-bottom pb-2"><strong>Compétences personnelles</strong></p>
                                            <ul>
                                                {softskillsannonce.map((skill, index) => {
                                                    return ( 
                                                        <li>{skill.softskills + ","}  </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="col-md-4">
                                            <p className="text-center border-bottom pb-2"><strong>Compétences linguistiques</strong></p>
                                            <ul>
                                                {languageannonce.map((skill, index) => {
                                                    return ( 
                                                        <li>
                                                            {skill.language},<br/>
                                                            <span className="small">(
                                                                Lu : {(skill.read === "Debutant" ? "Débutant" : "") 
                                                                || (skill.read === "Intermediaire" ? "Intermédiaire" : "") 
                                                                || (skill.read === "Avance" ? "Avancé" : "") 
                                                                }
                                                            ),</span>
                                                            <span className="ms-1 small">(
                                                                Ecrit : {(skill.written === "Debutant" ? "Débutant" : "") 
                                                                || (skill.written === "Intermediaire" ? "Intermédiaire" : "") 
                                                                || (skill.written === "Avance" ? "Avancé" : "") 
                                                                }
                                                            ),</span>
                                                            <span className="ms-1 small">(
                                                                Parlé : {(skill.spoken === "Debutant" ? "Débutant" : "") 
                                                                || (skill.spoken === "Intermediaire" ? "Intermédiaire" : "") 
                                                                || (skill.spoken === "Avance" ? "Avancé" : "") 
                                                                }
                                                            )</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {checkQuiz.length > 0 ? '' : (candidate.length > 0 || selected.length > 0) && 
                                <div className="mb-3">
                                    <form onSubmit={sendData}>
                                        <div className="row justify-content-center border-bottom mb-3">
                                            <div className="col-md-6 py-3">
                                                <select
                                                    className="form-select"
                                                    aria-label=".form-select example"
                                                    name="filter"
                                                    onChange={handleData}
                                                    value={filtrage.filter}
                                                >
                                                    <option value="">---- Veuillez choisir le type de filtrage ----</option>
                                                    <option value="all">Choisir tous</option>
                                                    <option value="expereince">Ignorer les années d'expériences</option>
                                                    <option value="softskills">Ignorer les compétences personnelles</option>
                                                    <option value="hardskills">Ignorer les compétences techniques</option>
                                                    <option value="languages">Ignorer les compétences linguistiques</option>
                                                    <option value="languages_levels">Ignorer les niveaux de la compétence linguistique</option>
                                                    <option value="not_all">Ignorer tous</option>
                                                </select>
                                                <div className="text-danger"></div>
                                            </div>
                                            <div className="col-md-2 py-3">
                                                <button className="btn btn-primary">Filter</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>}
                                {candidate.length > 0 ?
                                    <>
                                        <div className="row">
                                            <div className="col-md-12 border-bottom">
                                                <h3 className=" text-center py-3">Liste des candidats pour l'annonce {name.job_position}</h3>
                                            </div>
                                            <div className="col-md-2 border-bottom py-3 bg-white">
                                                <h5 className="text-center">Candidats</h5>
                                            </div>
                                            <div className="col-md-2 border-bottom py-3 bg-white">
                                                <h5 className="text-center">Expériences</h5>
                                            </div>
                                            <div className="col-md-3 border-bottom py-3 bg-white">
                                                <h5 className="text-center">Compétences personnelles</h5>
                                            </div>
                                            <div className="col-md-2 border-bottom py-3 bg-white">
                                                <h5 className="text-center">Compétences techniques</h5>
                                            </div>
                                            <div className="col-md-3 border-bottom py-3 bg-white">
                                                <h5 className="text-center">Langues</h5>
                                            </div>
                                        </div>
                                        {candidate.map((list, index) => {
                                            return (
                                                <div className="row align-items-center border-bottom pt-4 bg-white">
                                                    <div className="col-md-2">
                                                        <div className="text-center">
                                                            {list.photo === null ? <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/> :
                                                                <img src={"http://127.0.0.1:8000/storage/"+list.photo} alt="profile" className="profile-img rounded-circle"/>
                                                            }
                                                        </div>
                                                        <h5 className="ps-2 py-3 text-center">
                                                            {list.fname + ' ' + list.lname} <br/> 
                                                            {/* {list.profil} */}
                                                        </h5>
                                                    </div>
                                                    <div className="col-md-2">
                                                        {yearsExperince.map((exp, index) => {
                                                            return (
                                                                <h5 className="text-center">
                                                                    {list.id === exp.candidate_id ?
                                                                    exp.years <= 1 ? exp.years + " année d'expérience" : exp.years + " années d'expériences" : ''}
                                                                </h5>   
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="ps-4">
                                                            {softskills.map((soft, index) => {
                                                                return (
                                                                    <ul>
                                                                        { list.id === soft.candidate_id ?
                                                                            <li>{list.id === soft.candidate_id ? soft.softskills : '' }</li>: ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="ps-4">
                                                            {hardskills.map((hard, index) => {
                                                                return (
                                                                    <ul>
                                                                        {list.id === hard.candidate_id ? 
                                                                            <li>{hard.hardskills}</li> : ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="ps-4">
                                                            {language.map((lang, index) => {
                                                                return (
                                                                    <ul>
                                                                        {list.id === lang.candidate_id ?
                                                                            <li>
                                                                                {lang.language}<br/>
                                                                                <span className="small">
                                                                                    lu : {(lang.read === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.read === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.read === "Avance" ? "Avancé" : "") 
                                                                                    },
                                                                                </span>
                                                                                <span className="ms-2 small">
                                                                                    Ecrit : {(lang.written === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.written === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.written === "Avance" ? "Avancé" : "") 
                                                                                    },
                                                                                </span>
                                                                                <span className="ms-2 small">
                                                                                    Parlé : {(lang.spoken === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.spoken === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.spoken === "Avance" ? "Avancé" : "") 
                                                                                    },
                                                                                </span>
                                                                            </li> : ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </> : <h2 className="text-center mt-5 pt-5">Pas de candidats</h2>}
                                </div>
                            </div>
                            {selected.length > 0 &&
                            <>
                                <div className="mt-5">
                                    <h2 className="text-center">Candidats filtrés</h2>{type}
                                </div>
                                <div className="row mt-5">
                                    <div className="col-md-12 border-bottom py-2">
                                        <h3 className="text-center">L'adéquation des compétences</h3>
                                    </div>
                                    <div className="col-md-2 border-bottom py-2 bg-white">
                                        <h5 className="text-center">Candidats</h5>
                                    </div>
                                    <div className="col-md-2 border-bottom py-2 bg-white">
                                        <h5 className="text-center">Expériences</h5>
                                    </div>
                                    <div className="col-md-3 border-bottom py-2 bg-white">
                                        <h5 className="text-center">Compétences personnelles</h5>
                                    </div>
                                    <div className="col-md-3 border-bottom py-2 bg-white">
                                        <h5 className="text-center">Compétences techniques</h5>
                                    </div>
                                    <div className="col-md-2 border-bottom py-2 bg-white">
                                        <h5 className="text-center">Langues</h5>
                                    </div>
                                </div>
                                {selected.length > 0 && selected.map((list, index) => {
                                    return (
                                        <div className="row align-items-center border-bottom pt-4 bg-white">
                                            <div className="col-md-2">
                                                <div className="text-center">
                                                    {
                                                        list.photo === null ? <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/> :
                                                        <img src={"http://127.0.0.1:8000/storage/"+list.photo} alt="profile" className="profile-img rounded-circle"/>
                                                    }
                                                </div>
                                                <h5 className="ps-2 py-3 text-center">{list.fname + ' ' + list.lname} </h5>
                                                <div className="text-center mb-3">
                                                    <Button variant="primary" onClick={() => toggleModal(list.candidate_id)}>
                                                        CV
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="ps-4">
                                                    <p className="text-center">
                                                        <strong>
                                                            {(list.filtring_type === 'no_experience' || list.filtring_type === 'not_all') ? 'Filtrage ignoré' 
                                                                : selectedExperience.map((year, index)=>{
                                                                return(
                                                                    <span>
                                                                        {list.candidate_id === year.candidate_id ?
                                                                        year.matched_experience <= 1 ? year.matched_experience + " année d'expérience" : year.matched_experience + " années d'expériences" : ''}
                                                                        {/* {list.candidate_id === year.candidate_id ? year.matched_experience : ''} */}
                                                                    </span>
                                                                )
                                                            })}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="ps-4">
                                                    {(list.filtring_type === 'no_softskill' || list.filtring_type === 'not_all') ? <p className="text-center"><strong>Filtrage ignoré</strong></p> :
                                                        <div>
                                                            {selectedSoftskills.map((soft, index) => {
                                                                return (
                                                                    <ul>
                                                                        { list.candidate_id === soft.candidate_id ?
                                                                            <li>{soft.matched_softskill}</li>: ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="ps-4">
                                                    {(list.filtring_type === 'no_hardskill' || list.filtring_type === 'not_all') ? <p className="text-center"><strong>Filtrage ignoré</strong></p> : 
                                                        <div>
                                                            {selectedHardskills.map((hard, index) => {
                                                                return (
                                                                    <ul> 
                                                                        { list.candidate_id === hard.candidate_id ?
                                                                            <li>{hard.matched_hardskill}</li>: ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="ps-4">
                                                    {(list.filtring_type === 'no_language' || list.filtring_type === 'not_all') ? <p className="text-center"><strong>Filtrage ignoré</strong></p> :
                                                        <div>
                                                            {selectedLanguage.map((lang, index) => {
                                                                return (
                                                                    <ul>
                                                                        { list.candidate_id === lang.candidate_id ?
                                                                            <li>
                                                                                {lang.matched_language},<br/>
                                                                                {
                                                                                   lang.read !== '' ?  
                                                                                <span className="ms-2 small">
                                                                                    - Lu : {(lang.read === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.read === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.read === "Avance" ? "Avancé" : "") 
                                                                                    },<br/>
                                                                                </span>
                                                                                : ''}
                                                                                {
                                                                                    lang.written !== '' ?
                                                                                <span className="ms-2 small">
                                                                                    - Ecrit : {(lang.written === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.written === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.written === "Avance" ? "Avancé" : "") 
                                                                                    },<br/>
                                                                                </span>
                                                                                 : ''}
                                                                                 {
                                                                                    lang.spoken !== '' ?
                                                                                <span className="ms-2 small">
                                                                                    - Parlé : {(lang.spoken === "Debutant" ? "Débutant" : "") 
                                                                                    || (lang.spoken === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                    || (lang.spoken === "Avance" ? "Avancé" : "") 
                                                                                    },<br/>
                                                                                </span>
                                                                                : ''}
                                                                            </li>: ''
                                                                        }
                                                                    </ul>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="row my-4">
                                    <div className="col-md-12 text-center">
                                        {passedQuiz.length > 0 ? 
                                        <button className="btn btn-primary fs-5" disabled>Demande de QCM a été déjà envoyé</button> : quiz.length <= 0 ?
                                        <button className="btn btn-primary fs-5" disabled>QCM pas encore ouvert</button> : 
                                            <form onSubmit={sendTest}>
                                                <button className="btn btn-primary fs-5">Envoyer le QCM</button>
                                            </form>
                                        }
                                    </div>
                                </div>
                                <Modal show={showModal} onHide={toggleModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>CV</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectedId && 
                                            <CandidateCV
                                                id={selectedId}
                                            />
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={toggleModal}>
                                            Fermer
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>}
                    </>}
                </>
                : <Navigate to="/login" />
            }
        </div>
    )
}