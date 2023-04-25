import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function CandidateAnswers(){
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    const { tokenRe  } = useContext(Auth)
    const [quiz, setQuiz] = useState([]);
    const [candidate, setCandidate] = useState([]);
    const [check, setCheck] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-result/" + id).then((response) => {
            setQuiz(response.data.result);
            setCandidate(response.data.candidat);
            setCheck(response.data.check);
            setIsLoading(false)
        });
    }, [id])
    console.log(candidate)
    function summonCandidate(e){
        e.preventDefault();
        const data = new FormData();
        data.append("ids", JSON.stringify(candidate));
        axios.post("http://127.0.0.1:8000/api/summon-candidate", data).then(response => {
            navigate('/recruiter/tests/', { state: response.data.message })
        })
    }
    return(
        <div className="container mt-5">
            {tokenRe ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <div>
                        {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                        {quiz.length > 0 ? 
                            <div>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-md-12">
                                        <h3 className=" text-center py-3">Les résultats du test</h3>
                                    </div>
                                    <div className="col-md-1 border-bottom border-top py-2 bg-white">
                                        <h5 className="text-center">#</h5>
                                    </div>
                                    <div className="col-md-2 border-bottom border-top py-2 bg-white">
                                        <h5 className="text-center">Candidats</h5>
                                    </div>
                                    <div className="col-md-5 border-bottom border-top py-2 bg-white">
                                        <h5 className="text-center">Score</h5>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    {candidate.map((name,key)=>{
                                        return(
                                            <div className="row align-items-center justify-content-center">
                                                <div className="col-md-1 border-bottom py-2 bg-white">
                                                    <div className="text-center">
                                                        <h5 className="ps-2 text-center">{key + 1}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 border-bottom py-2 bg-white">
                                                    <div className="text-center">
                                                        <h5 className="ps-2 text-center">{name.fname + ' '+ name.lname} </h5>
                                                    </div>
                                                </div>
                                                <div className="col-md-5 border-bottom py-2 bg-white">
                                                    <div className="text-center">
                                                        <h5 className="ps-2 text-center">{name.score+'/'+name.total}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                    {/* <form onSubmit={summonCandidate}>
                                        <div className="text-center mt-4">
                                            <button className="btn btn-primary fs-5">Convoquer</button>
                                        </div>
                                    </form> */}
                            </div>: check.length <= 0 ? 
                            <div className="text-center center">
                            <h2>Pas de résultat pour le moment</h2>
                            </div> :
                            <div className="text-center center">
                                <h2>Pas de candidat réussies dans ce test</h2>
                                {/* <h2>Pas de résultat pour le moment</h2> */}
                            </div>
                        }
                    </div>}
                </> 
                : <Navigate to="/login"/>
            }
        </div>
    )
}