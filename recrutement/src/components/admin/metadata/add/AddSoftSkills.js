import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListSoftskills from "../list/ListSoftskills";

export default function AddSoftSkills(){
    const navigate = useNavigate();
    const locationSoft = useLocation()
    const [softSkills, setSoftSkills] = useState({
        soft: [{
            softskills: '',
        }],
        error : []
    })
    function handleDataSoftSkills(event, index) {
        let data = [...softSkills.soft];
        data[index][event.target.name] = event.target.value;
        setSoftSkills(formData => ({
            ...formData,
            soft: data,
        }))
    }
    function addSoftSkill() {
        setSoftSkills({
            ...softSkills,
            soft: [...softSkills.soft, { softskills: "" }],
        });
    }
    function deleteSoftSkill(index) {
        const list = [...softSkills.soft];
        list.splice(index, 1);
        setSoftSkills({
            ...softSkills,
            soft: list,
        });
    }
    function sendData(event){
        event.preventDefault();
        const data = new FormData();
        data.append("soft", JSON.stringify(softSkills.soft));
        for(let i =0; i<softSkills.soft.length; i++){
            data.append("softskills", softSkills.soft[i].softskills);
        }
        axios.post("http://127.0.0.1:8000/api/add-softskills", data).then(response => {
            if (response.data.status === 400) {
                setSoftSkills(errors=>({
                    ...errors,
                    error: response.data.message_errors,
                }))
                console.log(response.data.message_errors)
            }else if(response.data.status === 200){
                setSoftSkills({
                    soft : [{
                        softskills: '',
                    }],
                })
                navigate('/admin/data', { state: response.data.message })
            }
        })
    }
    return(
        <div className="container mt-5">
            <h2>Compétences personnelles</h2>
            {locationSoft.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{locationSoft.state}</div>}
            <form onSubmit={sendData}>
                <div className="my-4 col-md-12">
                    {softSkills.soft.map((input, index) => {
                        return (
                            <>
                                <div className="row align-items-center justify-content-center" key={index}>
                                    <div className="form-floating col-md-9 mb-3">
                                        <input
                                            type="text"
                                            name="softskills"
                                            className="form-control"
                                            list={"data_soft" + index}
                                            placeholder="softkills"
                                            onChange={event => handleDataSoftSkills(event, index)}
                                            value={input.softskills}
                                        />
                                        <label htmlFor="floatingsoftkills" className="ps-4">Compténce personnelle #{index + 1}</label>
                                        <div className="text-danger">{softSkills.error && softSkills.error.softskills}</div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className={softSkills.soft.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                            <div>
                                                <button
                                                    className="btn btn-success fs-4 border px-3"
                                                    type="button"
                                                    onClick={addSoftSkill}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>
                                            {softSkills.soft.length > 1 ?
                                                <div>
                                                    <button
                                                        className="btn btn-danger fs-4 border px-3"
                                                        type="button"
                                                        onClick={() => deleteSoftSkill(index)}
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
            <ListSoftskills/>
        </div>
    )
}