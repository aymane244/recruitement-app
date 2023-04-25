import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function TestStart(props){
    const { candidate } = useContext(Auth)
    const [currQuestion, setCurrQuestion] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [answer, setAnswer] = useState('')
    const [score, setScore] = useState(0);
    const lastIndex = props.test.length -1 < currQuestion
    const navigate = useNavigate();
    useEffect(() => {
        let timerId;
        if (props.runTimer) {
            setCountDown(60 * props.quize_id.timer);
            timerId = setInterval(() => {
                setCountDown((countDown) => countDown - 1);
            }, 1000);
        } else {
            clearInterval(timerId);
        }
        return () => clearInterval(timerId);
    }, [props.runTimer]);
    useEffect(() => {
        if (countDown < 0 && props.runTimer) {
            props.setRunTimer(false);
            console.log("expired");
            setCountDown(0);
        }
    }, [countDown, props.runTimer])
    function nextQuestion(){
        setCurrQuestion(currQuestion + 1);
        setAnswer("")
        if(answer === props.test[currQuestion].correct_choix){
            setScore(score + 1)
        }else{
            setScore(score);
        }
        const data = {
            candidat_id : candidate.id,
            quize_id : props.quize_id.id,
            annonce_id : props.quize_id.annonce_id,
            candidate_answer : answer,
            // candidate_score : answer === props.test[currQuestion].correct_choix ? score + 1 : score,
            candidate_question : props.test[currQuestion].question,
            correct : props.test[currQuestion].correct_choix,
        }
        axios.post("http://127.0.0.1:8000/api/send-answers", data).then(response => {
        })
    }
    function getAnswer(event){
        setAnswer(event.target.value)
    }
    function updateQuizeState(event){
        event.preventDefault();
        const data = {
            quize_id : props.quize_id.id,
            candidate_id : candidate.id,
            annonce_id : props.quize_id.annonce_id,
            total : props.count,
            candidate_score : score,
        }
        axios.post("http://127.0.0.1:8000/api/update-quize", data).then(response => {
            navigate('/candidate/tests')
        })
    }
    // if (window.performance) {
    //     if (performance.getEntriesByType("navigation")[0].type == 1) {
    //       alert( "This page is reloaded" );
    //     } else {
    //       alert( "This page is not reloaded");
    //     }
    // }
    const seconds = String(countDown % 60).padStart(2, 0);
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);
    return(
        <div className="container">
            <div className="border shadow mt-4 w-75 mx-auto bg-white">
                {lastIndex || props.runTimer === false ? 
                <>
                    <p className="fs-5 px-5 py-3 text-center">
                        {props.runTimer === false ? "Malheuresement vous n'avez pas réussi à términer le test dans le temps écoulé, nous vous souhaitons une bonne chance" :
                        lastIndex ? "Félicitation, vous avez bien términé votre test, nous vous souhaitons une bonne chance" : ''}
                    </p> 
                    <p className="fs-4 text-center my-4">Votre résultat est : {score+ '/' + props.count} <br/> {score >= (props.count*0.7) ? 'Félicitation vous avez réussi' : "Malheuresement vous n'avez pas réussi"}</p>
                    <form onSubmit={updateQuizeState}>
                        <div className="my-3 text-center">
                            <button className="btn btn-primary">Retourner à la page principale</button>
                        </div>
                    </form>
                </>
                    : 
                <>
                    <div>
                        <p className="fs-5 px-5 py-3 text-center">Question {currQuestion +1 + '/' + props.count}</p>
                        <p className="fs-5 px-5 text-center">Il vous reste {minutes}:{seconds}</p>
                        <p className="fs-5 px-5 py-3 text-center">{props.test[currQuestion].question}</p>
                            <div className="row justify-content-center">
                                <div className="col-md-5 border py-3 me-lg-5 pointer" style={answer === props.test[currQuestion].choix_1 ? {backgroundColor : "#198754", color : "white"} : {backgroundColor : "transparent", color : "black"}} onClick={() => setAnswer(props.test[currQuestion].choix_1)}>
                                    <div className="d-flex me-3">
                                        <input 
                                            type="radio" 
                                            name="answer"
                                            id="choix_1"
                                            className="pointer"
                                            checked={answer === props.test[currQuestion].choix_1}
                                            onChange={getAnswer}
                                            value={props.test[currQuestion].choix_1}
                                        />
                                        <label className="ms-4 pointer" htmlFor="choix_1">{props.test[currQuestion].choix_1}</label>
                                    </div>
                                </div>
                                <div className="col-md-5 border py-3 pointer" onClick={() => setAnswer(props.test[currQuestion].choix_2)} style={answer === props.test[currQuestion].choix_2 ? {backgroundColor : "#198754", color : "white"} : {backgroundColor : "transparent", color : "black"}}>
                                    <div className="d-flex me-3">
                                        <input 
                                            type="radio" 
                                            name="answer"
                                            className="pointer"
                                            checked={answer === props.test[currQuestion].choix_2}
                                            onChange={getAnswer}
                                            value={props.test[currQuestion].choix_2}
                                        />
                                        <label className="ms-4 pointer">{props.test[currQuestion].choix_2}</label>
                                    </div>
                                </div>
                                <div className="col-md-5 border py-3 me-lg-5 my-3 pointer" onClick={() => setAnswer(props.test[currQuestion].choix_3)} style={answer === props.test[currQuestion].choix_3 ? {backgroundColor : "#198754", color : "white"} : {backgroundColor : "transparent", color : "black"}}>
                                    <div className="d-flex me-3">
                                        <input
                                            type="radio" 
                                            name="answer"
                                            className="pointer"
                                            checked={answer === props.test[currQuestion].choix_3}
                                            onChange={getAnswer}
                                            value={props.test[currQuestion].choix_3}
                                        />
                                        <label className="ms-4 pointer">{props.test[currQuestion].choix_3}</label>
                                    </div>
                                </div>
                                <div className="col-md-5 border py-3 my-3 pointer" onClick={() => setAnswer(props.test[currQuestion].choix_4)} style={answer === props.test[currQuestion].choix_4 ? {backgroundColor : "#198754", color : "white"} : {backgroundColor : "transparent", color : "black"}}>
                                    <div className="d-flex me-3">
                                        <input  
                                            type="radio" 
                                            name="answer"
                                            className="pointer"
                                            checked={answer === props.test[currQuestion].choix_4}
                                            onChange={getAnswer}
                                            value={props.test[currQuestion].choix_4}
                                        />
                                        <label className="ms-4 pointer">{props.test[currQuestion].choix_4}</label>
                                    </div>
                                </div>
                                <div className="text-center my-4">
                                    {answer === "" ?
                                    <button 
                                        className="btn btn-dark" 
                                        onClick={nextQuestion}
                                        disabled
                                    >Question suivante
                                    </button> : 
                                    <button 
                                        className="btn btn-dark" 
                                        onClick={nextQuestion}
                                    >{currQuestion === props.test.length -1 ? 'Finir' : 'Question suivante'}
                                    </button>
                                    }
                                    
                                </div>
                            </div>
                    </div>
                </>
                }
            </div>
        </div>
    )
}