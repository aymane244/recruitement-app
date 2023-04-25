import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function ListEntreprises(){
    const { apiAdmin, token } = useContext(Auth)
    const [recruiter, setRecruiter] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getEntreprises() {
            const data = await apiAdmin.get('/api/get-recruiters');
            setRecruiter(data.data.entreprise);
            setIsLoading(false);
        }
        getEntreprises()
    }, [])
    let i = 1;
    return(
        <div className="container mt-5">
            {token ? 
                <>
                {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                <>
                    <h2 className="my-3 text-center">Liste des entreprises</h2>
                    {recruiter.length > 0 ? 
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Entreprises</th>
                                    <th>Email</th>
                                    <th>N° ICE</th>
                                    <th>N° registre de commerce</th>
                                    <th>Pays</th>
                                    <th>Ville</th>
                                    <th>N° d'annonce</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {recruiter.map((list, index) => {
                                    return (
                                        <tr>
                                            <th>{i++}</th>
                                            <th>{list.name}</th>
                                            <th>{list.email}</th>
                                            <th>{list.ice}</th>
                                            <th>{list.registre}</th>
                                            <th>{list.recruiter_country}</th>
                                            <th>{list.recruiter_city}</th>
                                            <th>{list.annonces}</th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    : <h2 className="text-center mt-5 pt-5">Pas d'entreprise pour le moment</h2>}
                </>}
                </>
            :  <Navigate to="/admin"/>}
        </div>
    )
}