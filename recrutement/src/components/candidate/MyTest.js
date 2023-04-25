import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function MyTest() {
    const { apiCandidate, tokenCa } = useContext(Auth)
    const [quiz, setQuiz] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function getSelected() {
            const my_tests = await apiCandidate.get('/api/get-tests/');
            setQuiz(my_tests.data.tests)
            setIsLoading(false);
        }
        getSelected()
    }, [])
    // if (window.performance) {
    //     if (performance.getEntriesByType("navigation")[0].type == 1) {
    //       alert( "This page is reloaded" );
    //     } else {
    //       alert( "This page is not reloaded");
    //     }
    //   }
    let i = 1;
    return (
        <div className="container mt-5">
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <>
                        <h2 className="my-3 text-center">Vos tests</h2>
                        {quiz.length > 0 ? 
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Nom de test</th>
                                    <th>Annonce</th>
                                    <th>Entreprises</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {quiz.map((list, index) => {
                                    return (
                                        <tr key={index}>
                                            <th> {i++} </th>
                                            <th> {list.titre} </th>
                                            <th> {list.job_position} </th>
                                            <th> {list.name} </th>
                                            <th>
                                                <div className="row justify-content-center">
                                                    <div className="col-md-10">
                                                        {quiz.length < 0 ? <button className="btn btn-primary" disabled>Test n'est pas encore ouvert</button> :
                                                            list.test === 'passed' ? <button className="btn btn-primary" disabled>Vous avez passer votre test</button> :
                                                                <a href={"/candidate/test/" + list.quize_id} className="btn btn-primary">Passer votre test</a>}
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        :  <h2 className="text-center mt-5 pt-5">Pas de Test pour le moment</h2>}
                    </>}
                </> : <Navigate to="/login" />}
        </div>
    )
}