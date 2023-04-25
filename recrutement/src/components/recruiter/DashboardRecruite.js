import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Footer from "../home/pages/Footer";
import { Auth } from "../context/AuthContext";

export default function DashboardRecruite() {
    const { recruiter, tokenRe, setAuth, api, } = useContext(Auth);
    setAuth(true);
    let i = 1;
    let j = 1;
    let a = 1;
    let b = 1;
    let c = 1;
    const [isLoading, setIsLoading] = useState(true)
    const [offers, setOffers] = useState([]);
    const [offersOpen, setOffersOpen] = useState([]);
    const [offersClose, setOffersClose] = useState([]);
    const [applications, setApplications] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [success, setSuccess] = useState([]);
    const [recommandation, setRecommandation] = useState([]);
    const [annonceList, setAnnonceList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    const [applicationList, setApplicationList] = useState([]);
    const [applicationListSuccess, setApplicationListSuccess] = useState([]);
    const [recommandationList, setRecommandationList] = useState([]);
    useEffect(() => {
        async function getOffers() {
            const offer = await api.get('/api/get-totaloffers')
            setOffers(offer.data.annonces)
            setOffersOpen(offer.data.annonces_open)
            setOffersClose(offer.data.annonces_close)
            setApplications(offer.data.applications)
            setQuiz(offer.data.quiz)
            setSuccess(offer.data.success)
            setRecommandation(offer.data.recommandations)
            setAnnonceList(offer.data.annonces_list)
            setQuizList(offer.data.quiz_list)
            setApplicationList(offer.data.applications_list)
            setApplicationListSuccess(offer.data.applications_success)
            setRecommandationList(offer.data.recommandations_list)
            setIsLoading(false);
        }
        getOffers()
    }, [])
    return (
        <div>
            {tokenRe ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> : 
                    <><div className="container">
                            <h1 className="text-center my-4">Bienvenue sur votre profile {recruiter.name}</h1>
                            <div className="row justify-content-center my-2">
                                <div class="col-sm-4 mb-3 mb-sm-0">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h3 className="text-center border-bottom">Vos annonces</h3>
                                            <div className="d-flex justify-content-around">
                                                <h4 className="text-cente mt-3">Total d'annonces :</h4>
                                                <h4 className="text-cente mt-3">{offers}</h4>
                                            </div>
                                            <div className="d-flex justify-content-around py-3">
                                                <h4 className="text-cente">Annonces ouvert :</h4>
                                                <h4 className="text-cente">{offersOpen}</h4>
                                            </div>
                                            <div className="d-flex justify-content-around">
                                                <h4 className="text-cente">Annonces fermés :</h4>
                                                <h4 className="text-cente">{offersClose}</h4>
                                            </div>
                                            <div className="text-center mt-3 mt-lg-5 d-flex justify-content-around">
                                                <a href="add-job-offer" className="btn btn-primary" target="_blank">Créer une annonce</a>
                                                <a href="annonces" className="btn btn-primary" target="_blank">Voir les annonces</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4 mb-3 mb-sm-0">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h3 className="text-center border-bottom">Vos test</h3>
                                            <div className="d-flex justify-content-around">
                                                <h4 className="text-cente my-3">Total des tests :</h4>
                                                <h4 className="text-cente my-3">{quiz}</h4>
                                            </div>
                                            <div className="text-center mt-lg-5 pt-lg-5 mt-3 d-flex justify-content-around">
                                                <a href="add-test" className="btn btn-primary mt-lg-5" target="_blank">Créer test</a>
                                                <a href="tests" className="btn btn-primary mt-lg-5" target="_blank">Voir les tests</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h3 className="text-center border-bottom">Candidats</h3>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4 className="text-cente">Total des candidatures :</h4>
                                                <h4 className="text-cente">{applications}</h4>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4 className="text-cente mt-3">Total des candidats réussies :</h4>
                                                <h4 className="text-cente mt-3">{success}</h4>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4 className="text-cente mt-3">Total des candidats recommandés :</h4>
                                                <h4 className="text-cente mt-3">{recommandation}</h4>
                                            </div>
                                            <div className="mt-3 mt-lg-4 pt-lg-2 d-flex justify-content-around">
                                                <a href="candidates" className="btn btn-primary text-small" target="_blank">Candidats réussies</a>
                                                <a href="recommended" className="btn btn-primary text-small" target="_blank">Candidats recommandés</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste de vos annonces</h3>
                                    {annonceList.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th colSpan={3}> {recruiter.name}</th>
                                                </tr>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Etat</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {annonceList.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {i++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.isOpen === 0 ? 'Fermé' : 'Ouvert'} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas d'annonce pour le moment</h2>}
                                </div>
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste de vos tests</h3>
                                    {quizList.length > 0 ?
                                        <>
                                            <table className="table table-dark mt-3">
                                                <thead className="text-center">
                                                    <tr>
                                                        <th colSpan={3}> {recruiter.name}</th>
                                                    </tr>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Titre du quiz</th>
                                                        <th>Annonce</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {quizList.map((list, index) => {
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
                                        </> : <h2 className="text-center mt-5">Pas de quiz pour le moment</h2>}
                                </div>
                                <hr />
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste des candidatures</h3>
                                    {applicationList.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th colSpan={3}> {recruiter.name}</th>
                                                </tr>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Candidats</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {applicationList.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {a++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.fname + ' ' + list.lname} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de candidature pour le moment</h2>}
                                </div>
                                <div className="col-md-6">
                                    <h3 className="text-center">Liste des candidatures</h3>
                                    {applicationListSuccess.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th colSpan={3}> {recruiter.name}</th>
                                                </tr>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Annonce</th>
                                                    <th>Candidats</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {applicationListSuccess.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {b++} </th>
                                                            <th> {list.job_position} </th>
                                                            <th> {list.fname + ' ' + list.lname} </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de candidatures pour le moment</h2>}
                                </div>
                                <hr />
                                <div className="col-md-10">
                                    <h3 className="text-center">Liste des candidats recommandés</h3>
                                    {recommandationList.length > 0 ?
                                        <table className="table table-dark mt-3">
                                            <thead className="text-center">
                                                <tr>
                                                    <th colSpan={6}> {recruiter.name}</th>
                                                </tr>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Candidats</th>
                                                    <th>Entrerprise</th>
                                                    <th>Profil</th>
                                                    <th>Commentaires</th>
                                                    <th>Note</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center">
                                                {recommandationList.map((list, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th> {c++} </th>
                                                            <th> {list.fname + ' ' + list.lname} </th>
                                                            <th> {list.recruiter_id === recruiter.id ? 'Vous même' : list.name} </th>
                                                            <th> {list.profil} </th>
                                                            <th> {list.comment} </th>
                                                            <th>
                                                                <span className="fa-solid fa-star" style={list.rating >= 1 ? { color: 'orange' } : { color: '' }}></span>
                                                                <span className="fa-solid fa-star" style={list.rating >= 2 ? { color: 'orange' } : { color: '' }}></span>
                                                                <span className="fa-solid fa-star" style={list.rating >= 3 ? { color: 'orange' } : { color: '' }}></span>
                                                                <span className="fa-solid fa-star" style={list.rating >= 4 ? { color: 'orange' } : { color: '' }}></span>
                                                                <span className="fa-solid fa-star" style={list.rating >= 5 ? { color: 'orange' } : { color: '' }}></span>
                                                            </th>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table> : <h2 className="text-center mt-5">Pas de candidats recommandés pour le moment</h2>}
                                </div>
                            </div>
                        </div>
                    <Footer /></>}
                </>
                : <Navigate to="/login" />
            }
        </div>
    )
}