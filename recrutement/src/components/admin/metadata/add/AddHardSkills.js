import axios from "axios";
import React, { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../../../context/AuthContext";
import ListHardskills from "../list/ListHardskills";

export default function AddHardSkills(){
    const navigate = useNavigate();
    const locationHard = useLocation()
    const { token } = useContext(Auth)
    const [hardSkills, setHardSkills] = useState({
        hard: [{
            hardskills: '',
        }],
        error : []
    })
    function handleDataHardSkills(event, index) {
        let data = [...hardSkills.hard];
        data[index][event.target.name] = event.target.value;
        setHardSkills(formData => ({
            ...formData,
            hard: data,
        }))
    }
    function addHardSkill() {
        setHardSkills({
            ...hardSkills,
            hard: [...hardSkills.hard, { hardskills: "" }],
        });
    }
    function deleteHardSkill(index) {
        const list = [...hardSkills.hard];
        list.splice(index, 1);
        setHardSkills({
            ...hardSkills,
            hard: list,
        });
    }
    function sendData(event){
        event.preventDefault();
        const data = new FormData();
        data.append("hard", JSON.stringify(hardSkills.hard));
        for(let i =0; i<hardSkills.hard.length; i++){
            data.append("hardskills", hardSkills.hard[i].hardskills);
        }
        axios.post("http://127.0.0.1:8000/api/add-hardskills", data).then(response => {
            if (response.data.status === 400) {
                setHardSkills(errors=>({
                    ...errors,
                    error: response.data.message_errors,
                }))
            }else if(response.data.status === 200){
                setHardSkills({
                    hard : [{
                        hardskills: '',
                    }],
                })
                navigate('/admin/data', { state: response.data.message })
            }
        })
    }
    return(
        <div className="container mt-5" id="hard">
            {token ? 
                <>
                    <h2>Compétences techniques</h2>
                    {locationHard.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{locationHard.state}</div>}
                    <form onSubmit={sendData}>
                        <div className="my-4 col-md-12">
                            {hardSkills.hard.map((input, index) => {
                                return (
                                    <>
                                        <div className="row align-items-center justify-content-center" key={index}>
                                            <div className="form-floating col-md-9 mb-3">
                                                <input
                                                    type="text"
                                                    name="hardskills"
                                                    className="form-control"
                                                    id={index}
                                                    placeholder="hardkills"
                                                    onChange={event => handleDataHardSkills(event, index)}
                                                    value={input.hardskills}
                                                />
                                                <label htmlFor={index} className="ps-4">Compténce technique #{index + 1}</label>
                                                <div className="text-danger">{hardSkills.error && hardSkills.error.hardskills}</div>
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <div className={hardSkills.hard.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                    <div>
                                                        <button
                                                            className="btn btn-success fs-4 border px-3"
                                                            type="button"
                                                            onClick={addHardSkill}
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    {hardSkills.hard.length > 1 ?
                                                        <div>
                                                            <button
                                                                className="btn btn-danger fs-4 border px-3"
                                                                type="button"
                                                                onClick={() => deleteHardSkill(index)}
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div> : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                        <div className="col-md-12 mt-3">
                            <button className="btn btn-primary fs-5">Sauvegarder</button>
                        </div>
                    </form>
                    <hr/>
                    <ListHardskills/>
                </>
            : <Navigate to="/admin"/>} 
        </div>
    )
}