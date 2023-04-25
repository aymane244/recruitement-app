import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function EditTest() {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { tokenRe, api } = useContext(Auth)
    const [quizes, setQuiz] = useState([]);
    const [questions, setQuestion] = useState([]);
    const [annonces, setAnnonces] = useState([]);
    useEffect(() => {
        async function getQuizes() {
            const quiz = await api.get('/api/edit-test/' + id);
            setQuiz(quiz.data.quizes)
            setQuestion(quiz.data.questions)
            setIsLoading(false)
        }
        getQuizes()
    }, [])
    useEffect(() => {
        async function getAnnonce() {
            const annonce = await api.get('/api/loggedRecruiter');
            setAnnonces(annonce.data.annonces)
            setIsLoading(false)
        }
        getAnnonce()
    }, [])
    function handleData(e) {
        setQuiz(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    function handleDataQuestions(index, event) {
        let data = [...questions];
        data[index][event.target.name] = event.target.value;
        const updatedArray = questions.map(item => {
            if (item.question_id === data[index].question_id) {
                console.log(event.target.value)
                return { 
                    ...item, 
                    question: data[index].question
                };
            }
            return item;
        });
        setQuestion(updatedArray);
    }
    function handleDataCorrect(index, event){
        let data = [...questions];
        data[index].correct_choix = event.target.value;
        if(event.target.value === ''){
            alert('Veuillez saisir votre réponse en premier')
        }else{
            const updatedArray = questions.map(item => {
                if (item.question_id === data[index].question_id) {
                    return { 
                        ...item, 
                        question: data[index].question
                    };
                }
                return item;
            });
            setQuestion(updatedArray);
        }
    }
    function addQuestion(){
        setQuestion([...questions, {question :""}],);
    }
    function deleteQuestion(index, id_question){
        const list = [...questions];
        list.splice(index, 1);
        setQuestion(list);
        axios.delete("http://127.0.0.1:8000/api/delete-question/" + id_question).then((response) => {
            navigate('/recruiter/edit-test/' +id, { state: response.data.message })
            navigate(0);
        })
    }
    function sendData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("annonce", quizes.annonce);
        data.append("titre", quizes.titre);
        data.append("timer", quizes.timer);
        data.append("description", quizes.description);
        data.append("questions", JSON.stringify(questions));
        axios.post("http://127.0.0.1:8000/api/update-test/"+id, data).then(response => {
            navigate('/recruiter/tests', { state: response.data.message })
            navigate(0);
        })
    }
    console.log(quizes)
    return (
        <div className="container">
            {tokenRe ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <div>
                    <h1 className="mt-4 text-center">Modifier {quizes.titre} QCM</h1>
                    {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                    <form onSubmit={sendData}>
                        <div className="text-center mt-4">
                            <select
                                className="form-select w-50 mx-auto"
                                aria-label="Default select example"
                                name="annonce"
                                onChange={handleData}
                            >
                                <option value={quizes.annonce}>{quizes.job_position || ''}</option>
                                {annonces.map((list, index) => {
                                    return (
                                        <>
                                            {quizes.annonce === list.id ? '' :
                                            <option value={list.id} key={index}>{list.job_position}</option>}
                                        </>
                                    )
                                })}
                            </select>
                            {/* <div className="text-danger">{test.errors.poste}</div> */}
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
                                        value={quizes.titre}
                                        className="form-control"
                                        placeholder="Titre"
                                        aria-label="Text input with radio button"
                                    />
                                    <label htmlFor="titre" className="ps-4">Titre</label>
                                    {/* <div className="text-danger">{test.errors.titre}</div> */}
                                </div>
                                <h4>Déscription</h4>
                                <textarea
                                    name="description"
                                    onChange={handleData}
                                    value={quizes.description}
                                    className="form-control"
                                    placeholder="Veuillez une description pour le quiz"
                                    rows="6"
                                >
                                </textarea>
                                {/* <div className="text-danger">{test.errors.titre}</div> */}
                                <h4 className="mt-3">Durée/minute</h4>
                                <div className="form-floating mb-3">
                                    <input
                                        type="number"
                                        name="timer"
                                        id="timer"
                                        min="5"
                                        step="5"
                                        onChange={handleData}
                                        value={quizes.timer}
                                        className="form-control"
                                        placeholder="Durée"
                                    />
                                    <label htmlFor="Durée" className="ps-4">Durée</label>
                                    {/* <div className="text-danger">{test.errors.timer}</div> */}
                                </div>
                                {questions.map((indice, index) => {
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
                                            {/* <div className="text-danger">{test.errors.question}</div> */}
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
                                                        aria-label="Radio button for following text input"
                                                    />
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
                                                        aria-label="Text input with radio button"
                                                    />
                                                    <label htmlFor="choix_1" className="ps-4">Choix 1</label>
                                                </div>
                                            </div>
                                            {/* <div className="text-danger">{test.errors.choix_1}</div> */}
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
                                                        aria-label="Radio button for following text input"
                                                    />
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
                                                        aria-label="Text input with radio button"
                                                    />
                                                    <label htmlFor="choix_2" className="ps-4">Choix 2</label>
                                                </div>
                                            </div>
                                            {/* <div className="text-danger">{test.errors.choix_2}</div> */}
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
                                                        aria-label="Radio button for following text input"
                                                    />
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
                                                        aria-label="Text input with radio button"
                                                    />
                                                    <label htmlFor="choix_3" className="ps-4">Choix 3</label>
                                                </div>
                                            </div>
                                            {/* <div className="text-danger">{test.errors.choix_3}</div> */}
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
                                                        aria-label="Radio button for following text input"
                                                    />
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
                                                        aria-label="Text input with radio button"
                                                    />
                                                    <label htmlFor="choix_4" className="ps-4">Choix 4</label>
                                                </div>
                                            </div>
                                            {/* <div className="text-danger">{test.errors.choix_4}</div> */}
                                            {/* <div className="text-danger">{test.errors.correct_choix}</div> */}
                                            <div className="my-4 d-flex justify-content-around">
                                                <div>
                                                    <button
                                                        className="btn btn-success fs-4 border px-3"
                                                        type="button"
                                                        onClick={addQuestion}
                                                    >
                                                        <i className="fa-solid fa-plus"></i> Ajouter une question
                                                    </button >
                                                </div>
                                                {questions.length > 1 ?
                                                    <div>
                                                        <button
                                                            className="btn btn-danger fs-4 border px-3"
                                                            type="button"
                                                            onClick={() => deleteQuestion(index, indice.question_id)}
                                                        >
                                                            <i className="fa-solid fa-trash"></i> Supprimer la question
                                                        </button>
                                                    </div> : ''
                                                }
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                            <div className="col-md-10 text-center mb-3">
                                <button type="submit" className="btn btn-primary px-4 py-2 fs-5">Enregister le test</button>
                            </div>
                        </div>
                    </form>
                    </div>}
                </> :
                <Navigate to="/login" />
            }
        </div>
    )
}