import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function AddTest() {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const { api, tokenRe } = useContext(Auth)
    const [annonce, setAnnonce] = useState([]);
    const [test, setTest] = useState({
        poste: '',
        titre: '',
        timer: '',
        description: '',
        questions: [{
            question: '',
            correct_choix: '',
            choix_1: '',
            choix_2: '',
            choix_3: '',
            choix_4: '',
        }],
        errors : []
    });
    useEffect(() => {
        async function getAnnonce() {
            const annonce = await api.get('/api/loggedRecruiter');
            setAnnonce(annonce.data.annonces)
            setIsLoading(false)
        }
        getAnnonce()
    }, [])
    function handleData(e) {
        setTest(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    function handleDataQuestions(index, event) {
        let data = [...test.questions];
        data[index][event.target.name] = event.target.value;
        setTest(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            questions: data,
        }))
    }
    function handleDataCorrect(index, event){
        let data = [...test.questions];
        data[index].correct_choix = event.target.value;
        if(event.target.value === ''){
            alert('Veuillez saisir votre réponse en premier')
        }else{
            setTest(formData => ({
                ...formData,
                questions: data,
            }))
        }
    }
    function addQuestion(){
        setTest({
            ...test,
            questions: [...test.questions, { 
                    correct_choix: "" ,
                    choix_1: "" ,
                    choix_2: "" ,
                    choix_3: "" ,
                    choix_4: "" ,
                }],
          });
    }
    function deleteQuestion(index){
        const list = [...test.questions];
        list.splice(index, 1);
        setTest({
            ...test,
            questions: list,
        });
    }
    function sendData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("poste", test.poste);
        data.append("titre", test.titre);
        data.append("timer", test.timer);
        data.append("description", test.description);
        data.append("questions", JSON.stringify(test.questions));
        for(let i =0; i<test.questions.length; i++){
            data.append("question", test.questions[i].question);
        }
        for(let i =0; i<test.questions.length; i++){
            data.append("correct_choix", test.questions[i].correct_choix);
        }
        for(let i =0; i<test.questions.length; i++){
            data.append("choix_1", test.questions[i].choix_1);
        }
        for(let i =0; i<test.questions.length; i++){
            data.append("choix_2", test.questions[i].choix_2);
        }
        for(let i =0; i<test.questions.length; i++){
            data.append("choix_3", test.questions[i].choix_3);
        }
        for(let i =0; i<test.questions.length; i++){
            data.append("choix_4", test.questions[i].choix_4);
        }
        axios.post("http://127.0.0.1:8000/api/add-test", data).then(response => {
            if (response.data.status === 200) {
                navigate('/recruiter/tests', { state: response.data.message })
            }else if(response.data.status === 400){
                setTest(error => ({
                    ...error,
                    errors: response.data.message_errors,
                }))
            }
        })
    }
    return (
        <div className="container">
            {tokenRe ? 
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <><h1 className="mt-4 text-center">Créer votre test</h1><form onSubmit={sendData}>
                            <div className="text-center mt-4">
                                <select
                                    className="form-select w-50 mx-auto"
                                    aria-label="Default select example"
                                    name="poste"
                                    onChange={handleData}
                                >
                                    <option value="">-- Veuillez choisir un poste --</option>
                                    {annonce.map((list, index) => {
                                        return (
                                            <option value={list.id} key={index}>{list.job_position}</option>
                                        );
                                    })}
                                </select>
                                <div className="text-danger">{test.errors.poste}</div>
                            </div>
                            <div className="row justify-content-center mt-5">
                                <div className="col-md-10 mb-3">
                                    <h4>Titre</h4>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            name="titre"
                                            id="titre"
                                            onChange={handleData}
                                            value={test.titre}
                                            className="form-control"
                                            placeholder="Titre"
                                            aria-label="Text input with radio button" />
                                        <label htmlFor="titre" className="ps-4">Titre</label>
                                        <div className="text-danger">{test.errors.titre}</div>
                                    </div>
                                    <h4>Déscription</h4>
                                    <textarea
                                        name="description"
                                        onChange={handleData}
                                        value={test.description}
                                        className="form-control"
                                        placeholder="Veuillez une description pour le quiz"
                                        rows="6"
                                    >
                                    </textarea>
                                    <div className="text-danger">{test.errors.titre}</div>
                                    <h4 className="mt-3">Durée/minute</h4>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            name="timer"
                                            id="timer"
                                            min="5"
                                            step="5"
                                            onChange={handleData}
                                            value={test.timer}
                                            className="form-control"
                                            placeholder="Durée" />
                                        <label htmlFor="Durée" className="ps-4">Durée</label>
                                        <div className="text-danger">{test.errors.timer}</div>
                                    </div>
                                    {test.questions.map((indice, index) => {
                                        return (
                                            <>
                                                <h4>Question #{index + 1}</h4>
                                                <textarea
                                                    name="question"
                                                    onChange={(event) => handleDataQuestions(index, event)}
                                                    value={indice.question}
                                                    className="form-control"
                                                    placeholder="Veuillez saisir votre question"
                                                    rows="6"
                                                >
                                                </textarea>
                                                <div className="text-danger">{test.errors.question}</div>
                                                <h4 className="mt-4">Choix Multiples</h4><div className="input-group mt-3">
                                                    <div className="input-group-text">
                                                        <input
                                                            className="form-check-input mt-0"
                                                            name="correct_choix"
                                                            type="checkbox"
                                                            id={index}
                                                            onChange={(event) => handleDataCorrect(index, event)}
                                                            value={indice.choix_1}
                                                            checked={indice.correct_choix && indice.correct_choix === indice.choix_1}
                                                            aria-label="Radio button for following text input" />
                                                    </div>
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            name="choix_1"
                                                            id={index}
                                                            onChange={(event) => handleDataQuestions(index, event)}
                                                            value={indice.choix_1}
                                                            className="form-control"
                                                            placeholder="Choix 1"
                                                            aria-label="Text input with radio button" />
                                                        <label htmlFor="choix_1" className="ps-4">Choix 1</label>
                                                    </div>
                                                </div>
                                                <div className="text-danger">{test.errors.choix_1}</div>
                                                <div className="input-group mt-3">
                                                    <div className="input-group-text">
                                                        <input
                                                            className="form-check-input mt-0"
                                                            name="correct_choix"
                                                            type="checkbox"
                                                            id={index}
                                                            onChange={(event) => handleDataCorrect(index, event)}
                                                            value={indice.choix_2}
                                                            checked={indice.correct_choix && indice.correct_choix === indice.choix_2}
                                                            aria-label="Radio button for following text input" />
                                                    </div>
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            name="choix_2"
                                                            id={index}
                                                            onChange={(event) => handleDataQuestions(index, event)}
                                                            value={indice.choix_2}
                                                            className="form-control"
                                                            placeholder="Choix 2"
                                                            aria-label="Text input with radio button" />
                                                        <label htmlFor="choix_2" className="ps-4">Choix 2</label>
                                                    </div>
                                                </div>
                                                <div className="text-danger">{test.errors.choix_2}</div>
                                                <div className="input-group mt-3">
                                                    <div className="input-group-text">
                                                        <input
                                                            className="form-check-input mt-0"
                                                            name="correct_choix"
                                                            type="checkbox"
                                                            id={index}
                                                            onChange={(event) => handleDataCorrect(index, event)}
                                                            value={indice.choix_3}
                                                            checked={indice.correct_choix && indice.correct_choix === indice.choix_3}
                                                            aria-label="Radio button for following text input" />
                                                    </div>
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            name="choix_3"
                                                            id={index}
                                                            onChange={(event) => handleDataQuestions(index, event)}
                                                            value={indice.choix_3}
                                                            className="form-control"
                                                            placeholder="Choix 3"
                                                            aria-label="Text input with radio button" />
                                                        <label htmlFor="choix_3" className="ps-4">Choix 3</label>
                                                    </div>
                                                </div>
                                                <div className="text-danger">{test.errors.choix_3}</div>
                                                <div className="input-group mt-3">
                                                    <div className="input-group-text">
                                                        <input
                                                            className="form-check-input mt-0"
                                                            name="correct_choix"
                                                            type="checkbox"
                                                            id={index}
                                                            onChange={(event) => handleDataCorrect(index, event)}
                                                            value={indice.choix_4}
                                                            checked={indice.correct_choix && indice.correct_choix === indice.choix_4}
                                                            aria-label="Radio button for following text input" />
                                                    </div>
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            name="choix_4"
                                                            id={index}
                                                            onChange={(event) => handleDataQuestions(index, event)}
                                                            value={indice.choix_4}
                                                            className="form-control"
                                                            placeholder="Choix 4"
                                                            aria-label="Text input with radio button" />
                                                        <label htmlFor="choix_4" className="ps-4">Choix 4</label>
                                                    </div>
                                                </div>
                                                <div className="text-danger">{test.errors.choix_4}</div>
                                                <div className="text-danger">{test.errors.correct_choix}</div>
                                                <div className="my-4 d-flex justify-content-around">
                                                    <div>
                                                        <button
                                                            className="btn btn-success fs-4 border px-3"
                                                            type="button"
                                                            onClick={addQuestion}
                                                        >
                                                            <i className="fa-solid fa-plus"></i> Ajouter une question
                                                        </button>
                                                    </div>
                                                    {test.questions.length > 1 ?
                                                        <div>
                                                            <button
                                                                className="btn btn-danger fs-4 border px-3"
                                                                type="button"
                                                                onClick={() => deleteQuestion(index)}
                                                            >
                                                                <i className="fa-solid fa-trash"></i> Supprimer la question
                                                            </button>
                                                        </div> : ''}
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                                <div className="col-md-10 text-center mb-3">
                                    <button type="submit" className="btn btn-primary px-4 py-2 fs-5">Créer le test</button>
                                </div>
                                <div className="col-md-12">
                                    {test.questions.length > 0 &&
                                        <>
                                            <h3>Vos choix correct sont</h3>
                                            <ul>
                                                {test.questions.map((indice, index) => {
                                                    return indice.correct_choix.length ? (
                                                        <li key={index}><strong>Question #{(index + 1) + ': ' + indice.correct_choix}</strong></li>
                                                    ) : (
                                                        <li><strong>Pas de réponse encore pour la question {index + 1}, veuillez choisir une réponse</strong></li>
                                                    );
                                                })}
                                            </ul>
                                        </>}
                                </div>
                            </div>
                        </form></>}
                </> :
                    <Navigate to="/login"/>
            }
        </div>
    )
}