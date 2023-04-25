import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListLanguages from "../list/ListLanguages";

export default function AddLanguages(){
    const navigate = useNavigate();
    const locationLang = useLocation()
    const [language, setLangugage] = useState({
        lang : [{
            language: '',
        }],
        error : []
    })
    function handleDataLanguage(event, index){
        let data = [...language.lang];
        data[index][event.target.name] = event.target.value;
        setLangugage(formData => ({
            ...formData,
            lang : data,
        }))
    }
    function addLanguage(){
        setLangugage({
            ...language,
            lang: [...language.lang, { language: "" }],
          });
    }
    function deleteLanguage(index){
        const list = [...language.lang];
        list.splice(index, 1);
        setLangugage({
            ...language,
            lang: list,
        });
    }
    function sendData(event){
        event.preventDefault();
        const data = new FormData();
        data.append("lang", JSON.stringify(language.lang));
        for(let i =0; i<language.lang.length; i++){
            data.append("language", language.lang[i].language);
        }
        axios.post("http://127.0.0.1:8000/api/add-langugage", data).then(response => {
            if (response.data.status === 400) {
                setLangugage(errors=>({
                    ...errors,
                    error: response.data.message_errors,
                }))
            }else if(response.data.status === 200){
                setLangugage({
                    lang : [{
                        language: '',
                    }],
                })
                navigate('/admin/data', { state: response.data.message })
            }
        })
    }
    return(
        <div className="container mt-5">
            <h2>Langues</h2>
            {locationLang.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{locationLang.state}</div>}
            <form onSubmit={sendData}>
                <div className="my-4 col-md-12">
                    {language.lang.map((input, index) => {
                        return (
                            <>
                                <div className="row align-items-center justify-content-center" key={index}>
                                    <div className="form-floating col-md-9 mb-3">
                                        <input
                                            type="text"
                                            name="language"
                                            className="form-control"
                                            id="floatinglanguage"
                                            list={"data_lang" + index}
                                            placeholder="language"
                                            onChange={event => handleDataLanguage(event, index)}
                                            value={input.language}
                                        />
                                        <label htmlFor="floatinglanguage" className="ps-4">Langues #{index + 1}</label>
                                        <div className="text-danger">{language.error && language.error.language}</div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className={language.lang.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                            <div>
                                                <button
                                                    className="btn btn-success fs-4 border px-3"
                                                    type="button"
                                                    onClick={addLanguage}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>
                                            {language.lang.length > 1 ?
                                                <div>
                                                    <button
                                                        className="btn btn-danger fs-4 border px-3"
                                                        type="button"
                                                        onClick={() => deleteLanguage(index)}
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
                    <div className="col-md-12 mt-4">
                        <button className="btn btn-primary fs-5">Sauvegarder</button>
                    </div>
                </div>
            </form>
            <hr/>
            <ListLanguages/>
        </div>
    )
}