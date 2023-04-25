import axios from "axios";
import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";

export default function ListLanguages(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [lang, setLang] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-languages").then(response => {
        setLang(response.data.languages);
        setIsLoading(false)
    })
    }, [])
    function deletes(id, lang){
        const conf = window.confirm("Voulez vous supprimé la langue "+lang);
        if(conf){
            axios.delete("http://127.0.0.1:8000/api/delete-langAdmin/" + id).then((response) => {
                navigate('/admin/data/', { state: response.data.message })
                navigate(0)
            })
        }
    }
    let i = 1;
    return(
        <div className="container mt-5">
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <div>
                {lang.length > 0 ?
                <>
                    <h2 className="my-3 text-center">Liste</h2>
                        <table className="table table-dark">
                            <thead className="text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Langue</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {lang.map((list, index) => {
                                    return (
                                        <tr>
                                            <th>{i++}</th>
                                            <th>{list.language}</th>
                                            <th>
                                                <button className="bg-transparent border-0"onClick={()=>deletes(list.id, list.language)}>
                                                    <i className="fa-solid fa-trash text-danger fs-4"></i>
                                                </button>
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                    </table>
                </> :
                <h2 className="my-3 text-center">Pas de langues enregistrés</h2>
            }
            </div>}
        </div>
    )
}