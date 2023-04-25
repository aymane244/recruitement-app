import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListHardskills(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [hard, setHard] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-hardskills").then(response => {
        setHard(response.data.hardskills);
        setIsLoading(false)
    })
    }, [])
    function deletes(id, hard){
        const conf = window.confirm("Voulez vous supprimé la compétence "+hard);
        if(conf){
            axios.delete("http://127.0.0.1:8000/api/delete-hardAdmin/" + id).then((response) => {
                navigate('/admin/data', { state: response.data.message })
            })
        }
    }
    let i = 1;
    return(
        <div className="container mt-5">
            {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
            <div>
                {hard.length > 0 ?
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
                                {hard.map((list, index) => {
                                    return (
                                        <tr>
                                            <th>{i++}</th>
                                            <th>{list.hardskills}</th>
                                            <th>
                                                <button className="bg-transparent border-0"onClick={()=>deletes(list.id, list.hardskills)}>
                                                    <i className="fa-solid fa-trash text-danger fs-4"></i>
                                                </button>
                                            </th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                    </table>
                </> :
                <h2 className="my-3 text-center">Pas de compétences techniques enregistrées</h2>
            }
        </div>}
        </div>
    )
}