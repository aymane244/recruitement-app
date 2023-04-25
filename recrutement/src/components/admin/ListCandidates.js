import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function ListCandidates(){
    const { apiAdmin, token } = useContext(Auth)
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getCandidates() {
            const data = await apiAdmin.get('/api/get-candidates');
            setCandidates(data.data.candidates);
            setIsLoading(false);
        }
        getCandidates()
    }, [])
    let i = 1;
    return(
        <div className="container mt-5">
            {token ? 
                <>
                {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                <>
                    <h2 className="my-3 text-center">Liste des candidats</h2>
                    {candidates.length > 0 ?
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Nom et Prénom</th>
                                    <th>Email</th>
                                    <th>N° CIN</th>
                                    <th>Ville</th>
                                    <th>N° de candidature</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {candidates.map((list, index) => {
                                    return (
                                        <tr>
                                            <th>{i++}</th>
                                            <th>{list.fname + ' ' + list.lname}</th>
                                            <th>{list.email}</th>
                                            <th>{list.cin}</th>
                                            <th>{list.candidate_city}</th>
                                            <th>{list.application}</th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                     : <h2 className="text-center mt-5 pt-5">Pas de candidat pour le moment</h2>}
                </>}
            </> : <Navigate to="/admin"/>}
        </div>
    )
}