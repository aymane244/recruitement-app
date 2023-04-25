import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function ListOffers(){
    const { apiAdmin, token } = useContext(Auth)
    const [offer, setOffer] = useState([]);
    const [check, setCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getCandidates() {
            const data = await apiAdmin.get('/api/get-offers');
            setOffer(data.data.annonces);
            setIsLoading(false);
        }
        getCandidates()
    }, [])
    function handleAnnounce(id, event){
        const updatedArray = offer.map(item => {
            if (item.annonce === parseInt(event.target.name)) {
                console.log(item)
                return { 
                    ...item, 
                    isOpen : event.target.checked === true ? 1 : 0
                };
            }
            return item;
        });
        setOffer(updatedArray);
        if(parseInt(event.target.id) === id){
            setCheck(open=>!open)
            const data = new FormData();
            data.append("id", id);
            axios.post("http://127.0.0.1:8000/api/update-state", data).then(response => {
                // navigate(0);
            })
        }
    }
    let i = 1;
    return(
        <div className="container mt-5">
            {token ? 
                <>
                {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                <>
                    <h2 className="my-3 text-center">Liste des annonces</h2>
                    {offer.length > 0 ?
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Annonce</th>
                                    <th>Entreprise</th>
                                    <th>Pays</th>
                                    <th>Ville</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {offer.map((list, index) => {
                                    return (
                                        <tr>
                                            <th>{i++}</th>
                                            <th>{list.job_position}</th>
                                            <th>{list.name}</th>
                                            <th>{list.recruiter_country}</th>
                                            <th>{list.annonce_city}</th>
                                            <th>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        name={list.annonce}
                                                        type="checkbox"
                                                        role="switch"
                                                        id={list.annonce}
                                                        onChange={(event) => handleAnnounce(list.annonce, event)}
                                                        value={list.isOpen}
                                                        checked={check[index] || list.isOpen} />
                                                    <label className="form-check-label" for={list.annonce}>{(check[index] === true || list.isOpen === 1) ? 'Ouvert' : 'Fermé'}</label>
                                                </div>
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    : <h2 className="text-center mt-5 pt-5">Pas d'annonce pour le moment pour le moment</h2>}
                </>}
                </>
             : <Navigate to="/admin"/>}
        </div>
    )
}