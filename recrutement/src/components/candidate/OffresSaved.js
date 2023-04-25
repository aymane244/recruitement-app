import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function OffresSaved(){
    const { apiCandidate, tokenCa, candidate } = useContext(Auth)
    const [saves, setSaves] = useState([]);
    const [check, setCheck] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getResume() {
            const app = await apiCandidate.get('/api/get-candidate-offers');
            setSaves(app.data.saves)
            setCheck(app.data.saves_check)
            setIsLoading(false);
        }
        getResume()
    }, [])
    console.log(check)
    console.log(saves)
    let i = 1;
    return(
        <div className="container mt-5">
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <h2 className="my-3 text-center">Vos Annonces sauvgardés</h2>
                        {saves.length > 0 ?
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Mes annonces</th>
                                    <th>Entreprises</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {saves.map((list, index) => {
                                    return (
                                        <tr key={index}>
                                            <th> {i++} </th>
                                            <th> {list.job_position} </th>
                                            <th> {list.name} </th>
                                            <th>
                                                <div className="row justify-content-center">
                                                    <div className="col-md-10">
                                                        {check.map((value, indeic)=>{
                                                            return(
                                                                <div>
                                                                    {(value.annonce === list.annonce_id && value.candidat === candidate.id) ?
                                                                    <button className="btn btn-primary" disabled>Postulé</button> : 
                                                                    <a href={"/jobs/job-description/" + list.annonce_id} className="btn btn-primary">Postuler</a>
                                                                    }
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        : <h2 className="text-center mt-5 pt-5">Pas des annonces sauveagardés pour le moment</h2>}
                    </>}
                </> : <Navigate to="/login" />}
        </div>
    )
}