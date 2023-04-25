import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function CoverLetter(){
    const [letter, setLetter] = useState("")
    const [updateLetter, setUpdateLetter] = useState([])
    const {candidate, apiCandidate, tokenCa} = useContext(Auth)
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    async function sendData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("letter", letter || updateLetter);
        data.append("id", candidate.id);
        const create_letter = await apiCandidate.post('/api/create-cover-letter', data);
        setIsLoading(false);
        navigate('/candidate/cover-letter', { state: create_letter.data.message });
    }
    useEffect(() => {
        async function getCoverLetter() {
            const cover_lettre = await apiCandidate.get('/api/get-coverletter');
            setUpdateLetter(cover_lettre.data.letter)
            setIsLoading(false);
        }
        getCoverLetter()
    }, [candidate.id])
    return(
        <div className="container my-5">
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <h2 className="text-center">Lettre de motivation</h2>
                        <p className="my-4 fs-5 text-justify">
                            Dans cette rubrique, vous allez écrire les choses qui vous motivent à travailler
                            en entreprise ainsi que vous devez montrer toutes vos qualités techniques et
                            personnelles pour se démarquer auprès des autres candidats. <br />
                            La lettre de motivation est faite pour mettre en valeur vos compétences, vous devez
                            toujours faire attention à votre orthographe, la qualité de la rédaction est une chose
                            primordiale pour les recruteurs, elle est considérée comme une source de motivation vue
                            que vous faites un effort de plus pour postuler à leurs offres.
                        </p>
                        <hr />
                        <div className="row justify-content-center mt-4">
                            {location.state && 
                            <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                            <div className="col-md-8">
                                <form onSubmit={sendData}>
                                    {updateLetter ?
                                        <textarea
                                            name="cover_lettre_update"
                                            onChange={(event) => {
                                                if (event.key === 'Enter') {
                                                    document.createRange('\n');
                                                    event.preventDefault();
                                                }
                                                setUpdateLetter(event.target.value);
                                            } }
                                            value={updateLetter.letter}
                                            className="form-control fs-4"
                                            placeholder="Ecrire votre lettre de motivation"
                                            rows="13"
                                        >
                                        </textarea>
                                        :
                                        <textarea
                                            name="cover_lettre"
                                            onChange={(event) => {
                                                if (event.key === 'Enter') {
                                                    document.createRange('\n');
                                                    event.preventDefault();
                                                }
                                                setLetter(event.target.value);
                                            } }
                                            value={letter}
                                            className="form-control fs-4"
                                            placeholder="Ecrire votre lettre de motivation"
                                        rows="13"
                                        >
                                        </textarea>
                                    }
                                    <div className="text-center mt-4">
                                        <button className="btn btn-primary fs-5">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-4">
                                <h4 className="text-center">Liens utiles</h4>
                                <div>
                                    <p className="fs-5">
                                        Site pour corriger vos textes (orthographe & grammaire) :
                                        <a href="https://www.scribens.fr/" className="text-decoration-none" target="_blank">Scribens</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>}
                </> : <Navigate to="/login" />}
        </div>
    )
}