import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ListSoftskills(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [soft, setSoft] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-softskills").then(response => {
        setSoft(response.data.softskills);
        setIsLoading(false)
    })
    }, [])
    let i = 1;
    function deletes(id, soft){
        const conf = window.confirm("Voulez vous supprimé la compétence "+soft);
        if(conf){
            axios.delete("http://127.0.0.1:8000/api/delete-softAdmin/" + id).then((response) => {
                navigate('/admin/data/', { state: response.data.message })
                navigate(0)
            })
        }
    }
    return(
        <div className="container mt-5">
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <div>
                {soft.length > 0 ?
                    <>
                        <h2 className="my-3 text-center">Liste</h2>
                            <table className="table table-dark">
                                <thead className="text-center">
                                    <tr>
                                        <th>#</th>
                                        <th>Compétences personnelles</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {soft.map((list, index) => {
                                        return (
                                            <tr>
                                                <th>{i++}</th>
                                                <th>{list.softskills}</th>
                                                <th>
                                                    <button className="bg-transparent border-0"onClick={()=>deletes(list.id, list.softskills)}>
                                                        <i className="fa-solid fa-trash text-danger fs-4"></i>
                                                    </button>
                                                </th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                        </table>
                    </> :
                    <h2 className="my-3 text-center">Pas de compétences personnelles enregistrées</h2>
                }
            </div>}
        </div>
    )
}