import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Auth } from "../context/AuthContext";

export default function AddAnnounce(){
    const navigate = useNavigate();
    const { recruiter, tokenRe } = useContext(Auth);
    const [isLoading, setIsLoading] = useState(true)
    const [suggestHard, setSuggestHard] = useState({});
    const [suggestSoft, setSuggestSoft] = useState({});
    const [suggestLang, setSuggestLang] = useState({});
    const [metadatLanguage, setMetadataLanguage] = useState([]);
    const [metadatSoftskills, setMetadataSoftskills] = useState([]);
    const [metadatHardskills, setMetadataHardskills] = useState([]);
    const [annonce, setAnnonce] = useState({
        job_position : '',
        job_description : '',
        annonce_city : '',
        salary : '',
        position : '',
        contract : '',
        experience : '',
        study : '',
        certificate : [{
            fields : '',
        }],
        soft : [{
            softskills: '',
        }],
        hard : [{
            hardskills: '',
        }],
        lang : [{
            language: '',
            read: '',
            written: '',
            spoken: '',
        }],
        errors : [],
    })
    function handleData(e){
        setAnnonce(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    function handleDataCertificate(event,index){
        let data = [...annonce.certificate];
        data[index][event.target.name] = event.target.value;
        setAnnonce(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            certificate : data,
        }))
    }
    function addCertificate(){
        setAnnonce({
            ...annonce,
            certificate: [...annonce.certificate, { fields: "" }],
        });
    }
    function deleteCertificate(index){
        const list = [...annonce.certificate];
        list.splice(index, 1);
        setAnnonce({
            ...annonce,
            certificate: list,
        });
    }
    function handleDataSoftSkills(event,index){
        let data = [...annonce.soft];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatSoftskills).map((key)=>metadatSoftskills[key].softskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
            // setResfound(suggestion.length !== 0 ? true : false);
        }
        setSuggestSoft({...suggestSoft, [index]: suggestion});
        setAnnonce(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            soft : data,
        }))
    }
    function addSoftSkill(){
        setAnnonce({
            ...annonce,
            soft: [...annonce.soft, { softskills: "" }],
          });
    }
    function deleteSoftSkill(index){
        const list = [...annonce.soft];
        list.splice(index, 1);
        setAnnonce({
            ...annonce,
            soft: list,
        });
    }
    function handleDataHardSkills(event,index){
        let data = [...annonce.hard];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatHardskills).map((key)=>metadatHardskills[key].hardskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestHard({...suggestHard, [index]: suggestion});
        setAnnonce(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            hard : data,
        }))
    }
    function suggestedHard(event, index){
        let data = [...annonce.hard];
        let item = {...data[index]};
        item.hardskills = event.target.innerText;
        data[index] = item
        setAnnonce(formData => ({
            ...formData,
            hard : data,
        }))
        setSuggestHard([]);
    }
    function suggestedSoft(event, index){
        let data = [...annonce.soft];
        let item = {...data[index]};
        item.softskills = event.target.innerText;
        data[index] = item
        setAnnonce(formData => ({
            ...formData,
            soft : data,
        }))
        setSuggestSoft([]);
    }
    function suggestedLang(event, index){
        let data = [...annonce.lang];
        let item = {...data[index]};
        item.language = event.target.innerText;
        data[index] = item
        setAnnonce(formData => ({
            ...formData,
            lang : data,
        }))
        setSuggestLang([]);
    }
    function addHardSkill(){
        setAnnonce({
            ...annonce,
            hard: [...annonce.hard, { hardskills: "" }],
        });
    }
    function deleteHardSkill(index){
        const list = [...annonce.hard];
        list.splice(index, 1);
        setAnnonce({
            ...annonce,
            hard: list,
        });
    }
    function handleDataLanguage(event, index){
        let data = [...annonce.lang];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatLanguage).map((key)=>metadatLanguage[key].language)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestLang({...suggestLang, [index]: suggestion});
        setAnnonce(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            lang : data,
        }))
    }
    function addLanguage(){
        setAnnonce({
            ...annonce,
            lang: [...annonce.lang, { language: "" }],
          });
    }
    function deleteLanguage(index){
        const list = [...annonce.lang];
        list.splice(index, 1);
        setAnnonce({
            ...annonce,
            lang: list,
        });
    }
    function sendData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("job_position", annonce.job_position);
        data.append("annonce_city", annonce.annonce_city);
        data.append("position", annonce.position);
        data.append("study", annonce.study);
        data.append("contract", annonce.contract);
        data.append("experience", annonce.experience);
        data.append("salary", annonce.salary);
        data.append("job_description", annonce.job_description);
        data.append("recruiter", recruiter.id);
        data.append("certif",JSON.stringify(annonce.certificate));
        data.append("soft", JSON.stringify(annonce.soft));
        data.append("hard", JSON.stringify(annonce.hard));
        data.append("lang", JSON.stringify(annonce.lang));
        for(let i =0; i<annonce.certificate.length; i++){
            data.append("certificate", annonce.certificate[i].fields);
        }
        for(let i =0; i<annonce.soft.length; i++){
            data.append("softskills", annonce.soft[i].softskills);
        }
        for(let i =0; i<annonce.hard.length; i++){
            data.append("hardskills", annonce.hard[i].hardskills);
        }
        for(let i =0; i<annonce.lang.length; i++){
            data.append("language", annonce.lang[i].language);
        }
        for(let i =0; i<annonce.lang.length; i++){
            data.append("read", annonce.lang[i].read);
        }
        for(let i =0; i<annonce.lang.length; i++){
            data.append("written", annonce.lang[i].written);
        }
        for(let i =0; i<annonce.lang.length; i++){
            data.append("spoken", annonce.lang[i].spoken);
        }
        axios.post("http://127.0.0.1:8000/api/add-annonce", data).then(response => {
            if (response.data.status === 200) {
                navigate('/recruiter/annonces', { state: response.data.message })
            }else if(response.data.status === 400){
                setAnnonce(error => ({
                    ...error,
                    errors: response.data.message_errors,
                }))
            }
        })
    }
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/get-metatda").then(response => {
            setMetadataHardskills(response.data.hardskills)
            setMetadataLanguage(response.data.languages)
            setMetadataSoftskills(response.data.softskills)
            setIsLoading(false)
        })
    }, [])
    return(
        <div>
            <div className="container">
                {tokenRe ? 
                    <>
                        {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                        <>
                            <h1 className="text-center mt-5">Ajouter une annonce</h1>
                            <div className="bg-white px-5 pt-2 mb-5 rounded border shadow mt-3">    
                            <form onSubmit={sendData}>
                                <div className="row mt-5">
                                    <div className="form-floating mb-3 col-md-5">
                                        <input
                                            type="text"
                                            name="job_position"
                                            className="form-control"
                                            id="floatingjob_position"
                                            placeholder="job_position"
                                            onChange={handleData}
                                            value={annonce.job_position} />
                                        <label htmlFor="floatingjob_position" className="ps-4">Titre de poste</label>
                                        <div className="text-danger">{annonce.errors.job_position}</div>
                                    </div>
                                    <div className="form-floating mb-3 col-md-5">
                                        <input
                                            type="text"
                                            name="annonce_city"
                                            className="form-control"
                                            id="floatingCity"
                                            placeholder="city"
                                            onChange={handleData}
                                            value={annonce.annonce_city} />
                                        <label htmlFor="floatingCity" className="ps-4">Ville</label>
                                        <div className="text-danger">{annonce.errors.annonce_city}</div>
                                    </div>
                                    <div className="form-floating mb-3 col-md-2">
                                        <input
                                            type="number"
                                            name="position"
                                            min="1"
                                            className="form-control"
                                            id="floatingPosition"
                                            placeholder="position"
                                            onChange={handleData}
                                            value={annonce.position} />
                                        <label htmlFor="floatingPosition" className="ps-4">N° de Poste</label>
                                        <div className="text-danger">{annonce.errors.position}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            className="form-select padding-input"
                                            aria-label=".form-select-lg example"
                                            name="study"
                                            onChange={handleData}
                                            value={annonce.study}
                                        >
                                            <option value="">---- Veuillez choisir le niveau d'étude ----</option>
                                            <option value="Bac">Bac</option>
                                            <option value="Bac +2">Bac +2</option>
                                            <option value="Licence">Licence</option>
                                            <option value="Master">Master</option>
                                            <option value="Pas important">Pas important</option>
                                        </select>
                                        <div className="text-danger">{annonce.errors.study}</div>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        {annonce.certificate.map((input, index) => {
                                            return (
                                                <>
                                                    <div className="row align-items-center" key={index}>
                                                        <div className="form-floating col-md-9 mb-3">
                                                            <input
                                                                type="text"
                                                                name="fields"
                                                                className="form-control"
                                                                id="floatingcertficate"
                                                                placeholder="fields"
                                                                onChange={event => handleDataCertificate(event, index)}
                                                                value={input.fields} />
                                                            <label htmlFor="floatingcertficate" className="ps-4">Diplôme #{index + 1}</label>
                                                            <div className="text-danger">{annonce.errors.certificate}</div>
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <div className={annonce.certificate.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                <div>
                                                                    <button
                                                                        className="btn btn-success fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={addCertificate}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                                {annonce.certificate.length > 1 ?
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-danger fs-4 border px-3"
                                                                            type="button"
                                                                            onClick={() => deleteCertificate(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div className="col-md-4">
                                        <select
                                            className="form-select padding-input"
                                            aria-label=".form-select-lg example"
                                            name="contract"
                                            onChange={handleData}
                                            value={annonce.contract}
                                        >
                                            <option value="">---- Veuillez choisir type de contrat ----</option>
                                            <option value="CDI">CDI</option>
                                            <option value="CDD">CDD</option>
                                            <option value="Contrat anapec">Contrat anapec</option>
                                        </select>
                                        <div className="text-danger">{annonce.errors.contract}</div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <select
                                            className="form-select padding-input"
                                            aria-label=".form-select-lg example"
                                            name="experience"
                                            onChange={handleData}
                                            value={annonce.experience}
                                        >
                                            <option value="">---- Veuillez choisir niveau d'expérience ----</option>
                                            <option value="Debutant">Débutant</option>
                                            <option value="Intermediaire">Intérmediaire</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        <div className="text-danger">{annonce.errors.experience}</div>
                                    </div>
                                    <div className="form-floating mb-3 col-md-4">
                                        <input
                                            type="text"
                                            name="salary"
                                            className="form-control"
                                            id="floatingSalary"
                                            placeholder="salary"
                                            onChange={handleData}
                                            value={annonce.salary} />
                                        <label htmlFor="floatingSalary" className="ps-4">Salaire</label>
                                        <div className="text-danger">{annonce.errors.salary}</div>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        {annonce.hard.map((input, index) => {
                                            return (
                                                <>
                                                    <div className="row align-items-center" key={index}>
                                                        <div className="form-floating col-md-9 mb-3">
                                                            <input
                                                                type="text"
                                                                name="hardskills"
                                                                className="form-control"
                                                                id={index}
                                                                autocomplete="off"
                                                                list={'data_hard' + index}
                                                                placeholder="hardkills"
                                                                onChange={event => handleDataHardSkills(event, index)}
                                                                value={input.hardskills} />
                                                            <label htmlFor={index} className="ps-4">Compténce technique #{index + 1}</label>
                                                            <div className="text-danger">{annonce.errors.hardskills}</div>
                                                            {suggestHard[index] &&
                                                                <div id={'data_hard' + index}
                                                                    className="bg-white w-100 shadow pointer rounded-bottom"
                                                                >
                                                                    {suggestHard[index].map((value, key) => {
                                                                        return (
                                                                            <>
                                                                                <li
                                                                                    className="ps-3 py-2 border-bottom li-style"
                                                                                    value={value}
                                                                                    onClick={(event) => suggestedHard(event, index)}
                                                                                >{value}
                                                                                </li>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <div className={annonce.hard.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                <div>
                                                                    <button
                                                                        className="btn btn-success fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={addHardSkill}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                                {annonce.hard.length > 1 ?
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-danger fs-4 border px-3"
                                                                            type="button"
                                                                            onClick={() => deleteHardSkill(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        {annonce.soft.map((input, index) => {
                                            return (
                                                <>
                                                    <div className="row align-items-center" key={index}>
                                                        <div className="form-floating col-md-9 mb-3">
                                                            <input
                                                                type="text"
                                                                name="softskills"
                                                                className="form-control"
                                                                list={"data_soft" + index}
                                                                placeholder="softkills"
                                                                onChange={event => handleDataSoftSkills(event, index)}
                                                                value={input.softskills} />
                                                            <label htmlFor="floatingsoftkills" className="ps-4">Compténce personnelle #{index + 1}</label>
                                                            <div className="text-danger">{annonce.errors.softskills}</div>
                                                            {suggestSoft[index] &&
                                                                <div id={'data_soft' + index}
                                                                    className="bg-white w-100 shadow pointer rounded-bottom"
                                                                >
                                                                    {suggestSoft[index].map((value, key) => {
                                                                        return (
                                                                            <>
                                                                                <li
                                                                                    className="ps-3 py-2 border-bottom li-style"
                                                                                    value={value}
                                                                                    onClick={(event) => suggestedSoft(event, index)}
                                                                                >{value}
                                                                                </li>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>}
                                                        </div>
                                                        <div className="col-md-3 mb-3">
                                                            <div className={annonce.soft.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                <div>
                                                                    <button
                                                                        className="btn btn-success fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={addSoftSkill}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                                {annonce.soft.length > 1 ?
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-danger fs-4 border px-3"
                                                                            type="button"
                                                                            onClick={() => deleteSoftSkill(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div className="mb-3 col-md-12">
                                        {annonce.lang.map((input, index) => {
                                            return (
                                                <>
                                                    <div className="row" key={index}>
                                                        <div className="form-floating col-md-4 mb-3">
                                                            <input
                                                                type="text"
                                                                name="language"
                                                                className="form-control"
                                                                id="floatinglanguage"
                                                                list={"data_lang" + index}
                                                                placeholder="language"
                                                                onChange={event => handleDataLanguage(event, index)}
                                                                value={input.language} />
                                                            <label htmlFor="floatinglanguage" className="ps-4">Langues #{index + 1}</label>
                                                            <div className="text-danger">{annonce.errors.language}</div>
                                                            {suggestLang[index] &&
                                                                <div id={'data_lang' + index}
                                                                    className="bg-white w-100 shadow pointer rounded-bottom"
                                                                >
                                                                    {suggestLang[index].map((value, key) => {
                                                                        return (
                                                                            <>
                                                                                <li
                                                                                    className="ps-3 py-2 border-bottom li-style"
                                                                                    value={value}
                                                                                    onClick={(event) => suggestedLang(event, index)}
                                                                                >{value}
                                                                                </li>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>}
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select
                                                                className="form-select padding-input"
                                                                aria-label=".form-select-lg example"
                                                                name="read"
                                                                onChange={event => handleDataLanguage(event, index)}
                                                                value={input.read}
                                                            >
                                                                <option value="">---Niveau lu---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option>
                                                            </select>
                                                            <div className="text-danger">{annonce.errors.read}</div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select
                                                                className="form-select padding-input"
                                                                aria-label=".form-select-lg example"
                                                                name="written"
                                                                onChange={event => handleDataLanguage(event, index)}
                                                                value={input.written}
                                                            >
                                                                <option value="">---Niveau écrit---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmediaire</option>
                                                                <option value="Avance">Avancé</option>
                                                            </select>
                                                            <div className="text-danger">{annonce.errors.written}</div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select
                                                                className="form-select padding-input"
                                                                aria-label=".form-select-lg example"
                                                                name="spoken"
                                                                onChange={event => handleDataLanguage(event, index)}
                                                                value={input.spoken}
                                                            >
                                                                <option value="">---Niveau parlé---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmediaire</option>
                                                                <option value="Avance">Avancé</option>
                                                            </select>
                                                            <div className="text-danger">{annonce.errors.spoken}</div>
                                                        </div>
                                                        <div className="col-md-2 mb-3 mt-1">
                                                            <div className={annonce.lang.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                <div>
                                                                    <button
                                                                        className="btn btn-success fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={addLanguage}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                                {annonce.lang.length > 1 ?
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-danger fs-4 border px-3"
                                                                            type="button"
                                                                            onClick={() => deleteLanguage(index)}
                                                                        >
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div className="mb-3 col-md-12">
                                        <textarea
                                            name="job_description"
                                            className="form-control"
                                            placeholder="Déscription du poste"
                                            onChange={(event) => {
                                                if(event.key === 'Enter'){
                                                    document.createRange('\n')
                                                    event.preventDefault()
                                                }
                                                handleData(event)}
                                            }
                                            rows="6"
                                            value={annonce.job_description}
                                        >
                                        </textarea>
                                        <div className="text-danger">{annonce.errors.job_description}</div>
                                    </div>
                                    <div className="col-md-12 text-center my-4">
                                        <button className="btn btn-primary px-5 py-2 fs-5">Enregistrer annonce</button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </>}
                    </> :
                    <Navigate to="/login"/>
                }
            </div>
        </div>
    )
}