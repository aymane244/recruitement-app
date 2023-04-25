import React, { useContext, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";
import Footer from "../home/pages/Footer";

export default function DashboardCandiate(){
    const {candidate, tokenCa, setAuth, apiCandidate} = useContext(Auth);
    const [isLoading, setIsLoading] = useState(true)
    const [offres, setOffers] = useState([]);
    const [saves, setSaves] = useState([]);
    const [quize, setQuize] = useState([]);
    const [applications, setApplication] = useState([]);
    const [mySaves, setMySaves] = useState([]);
    const [myQuizes, setMyQuizes] = useState([]);
    setAuth(true);
    useEffect(() => {
        async function getOffers() {
            const total = await apiCandidate.get('/api/get-totals')
            setOffers(total.data.applications);
            setSaves(total.data.saves);
            setQuize(total.data.quizes);
            setApplication(total.data.applications_get);
            setMySaves(total.data.saves_get);
            setMyQuizes(total.data.quizes_get);
            setIsLoading(false);
        }
        getOffers()
    }, [])
    let i = 1;
    let j = 1;
    let a = 1;
    let image;
    if(candidate.photo === null){
        image = <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/>
    }else{
        image = <img src={"http://127.0.0.1:8000/storage/"+candidate.photo} alt="profile" className="profile-img rounded-circle"/>
    }
    return(
        <div>
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <div className="container">
                            <div className="my-4 d-flex justify-content-center align-items-center">
                                {image} <h4 className="ms-3">Bienvenue sur votre profile <br /> {candidate.fname} {candidate.lname}</h4>
                            </div>
                            <div className="row justify-content-center my-2">
                                <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2">
                                    <h3 className="text-center border-bottom pb-2">Candiadtures</h3>
                                    <div className="d-flex justify-content-around">
                                        <h4 className="text-cente">Total :</h4>
                                        <h4 className="text-cente">{offres}</h4>
                                    </div>
                                </div>
                                <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2 mx-4 position-relative">
                                    <h3 className="text-center border-bottom pb-2">Offres sauvegardés</h3>
                                    <div className="d-flex justify-content-around">
                                        <h4 className="text-cente">Total :</h4>
                                        <h4 className="text-cente">{saves}</h4>
                                    </div>
                                </div>
                                <div className="col-md-3 border py-4 px-2 rounded shadow bg-white my-2 mx-4 position-relative">
                                    <h3 className="text-center border-bottom pb-2">Tests effectués</h3>
                                    <div className="d-flex justify-content-around">
                                        <h4 className="text-cente">Total :</h4>
                                        <h4 className="text-cente">{quize}</h4>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste de vos candidatures</h3>
                                    {applications.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Entreprise</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {applications.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {i++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.name} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de candiadture pour le moment</h2>}
                                </div>
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste de tests effectués </h3>
                                    {myQuizes.length > 0 ?
                                        <>
                                            <table className="table table-dark mt-3">
                                                <thead className="text-center">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Titre du quiz</th>
                                                        <th>Annonce</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {myQuizes.map((list, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th> {j++} </th>
                                                                <th> {list.titre} </th>
                                                                <th> {list.job_position} </th>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </> : <h2 className="text-center mt-5">Vous n'avez pas passé aucun quiz pour le moment</h2>}
                                </div>
                                <hr />
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste des offres sauvegardés</h3>
                                    {mySaves.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Entreprise</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {mySaves.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {a++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.name} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de'offre sauvegardé' pour le moment</h2>}
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </>}
                </> 
                : <Navigate to="/login" />
            }
        </div>
    )
}