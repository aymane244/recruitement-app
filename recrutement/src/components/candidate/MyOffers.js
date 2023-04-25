import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function MyOffers(){
    const { apiCandidate, tokenCa } = useContext(Auth)
    const [annonce, setAnnonce] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getResume() {
            const app = await apiCandidate.get('/api/get-candidate-applications');
            setAnnonce(app.data.applications)
            setIsLoading(false);
        }
        getResume()
    }, [])
    console.log(annonce)
    let i = 1;
    return(
        <div className="container mt-5">
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <h2 className="my-3 text-center">Vos candidatures</h2>
                        {annonce.length > 0 ?
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Mes annonces</th>
                                    <th>Entreprises</th>
                                    <th>Etat</th>
                                    <th>Convocation</th>
                                    <th>Date d'entretien</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {annonce.map((list, index) => {
                                    return (
                                        <tr key={index}>
                                            <th> {i++} </th>
                                            <th> {list.job_position} </th>
                                            <th> {list.name} </th>
                                            <th>
                                                <div className="row justify-content-center">
                                                    <div className="col-md-10">
                                                        {list.summon === 'yes' ? <p>Processus réussi félicitation </p> : list.summon === "no" ?
                                                            <p>Processus non réussi </p>:
                                                            <p>Votre candidature en cours de traitement</p>
                                                            }
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                {list.date_interview === '' ? <p>-</p> : <p>Convoqué pour entretien</p>}
                                            </th>
                                            <th>
                                                {list.date_interview === '' ? <p>-</p> : <p>{list.date_interview + ' ' + list.time_interview}</p>}
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        : <h2 className="text-center mt-5 pt-5">Pas de candidature pour le moment</h2>}
                    </>}
                </> : <Navigate to="/login" />}
        </div>
    )
}