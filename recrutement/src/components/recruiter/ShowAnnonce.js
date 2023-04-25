import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function ShowAnnonce() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();
    const { recruiter, api, tokenRe } = useContext(Auth)
    const [annonce, setAnnonce] = useState([]);
    let options = { year: 'numeric', month: 'long', day: 'numeric'};
    useEffect(() => {
        async function getRecruiter() {
            const annonce = await api.get('/api/loggedRecruiter');
            setAnnonce(annonce.data.annonces)
            setIsLoading(false)
        }
        getRecruiter()
    }, [])
    function deletes(id, name){
        const conf = window.confirm("Voulez vous supprimé l'annonce "+name);
        if (conf){
            axios.delete("http://127.0.0.1:8000/api/delete-annonce/" + id).then((response) => {
                navigate('/recruiter/annonces/', { state: response.data.message })
                navigate(0)
            })
        }
    }
    let i = 1;
    return (
        <div className="container mt-5">
            {tokenRe ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <div>
                        <div className="text-center my-4">
                            <a href="add-job-offer" className="btn btn-primary fs-4" target="_blank">Créer une annonce</a>
                        </div>
                        {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                        {annonce.length > 0 ? 
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th colSpan={5}> {recruiter.name}</th>
                                </tr>
                                <tr>
                                    <th>#</th>
                                    <th>Annonce</th>
                                    <th>Posté</th>
                                    <th>Etat</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {annonce.map((list, index) => {
                                    return (
                                        <tr key={index}>
                                            <th> {i++} </th>
                                            <th> {list.job_position} </th>
                                            <th> {new Date(list.created_at).toLocaleDateString("fr-FR", options)} </th>
                                            <th> Active </th>
                                            <th>
                                                <div className="d-flex justify-content-around align-items-center">
                                                    <div>
                                                        <Link to={"/recruiter/candidats-annonces/" + list.id} className="btn btn-primary">Voir les candidats</Link>
                                                    </div>
                                                    <div>
                                                        <a href={"/recruiter/edit_annonce/" + list.id} target="_blank"><i className="fa-solid fa-pen-to-square text-success fs-4"></i></a>
                                                    </div>
                                                    <div>
                                                        <button className="bg-transparent border-0"onClick={()=>deletes(list.id, list.job_position)}>
                                                            <i className="fa-solid fa-trash text-danger fs-4"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table> : <h2 className="text-center mt-5 pt-5">Pas d'annonce pour le moment</h2>
                        }
                    </div>}
                </> 
                : <Navigate to="/login" />
            }
        </div>
    )
}