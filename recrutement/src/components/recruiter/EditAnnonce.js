import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function EditAnnonce(){
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const location = useLocation();
    const { tokenRe } = useContext(Auth)
    const [annonce, setAnnonce] = useState([]);
    const [hardskills, setHardskills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [softskills, setSoftskills] = useState([]);
    const [certificate, setCertificate] = useState([]);
    const [suggestHard, setSuggestHard] = useState({});
    const [suggestSoft, setSuggestSoft] = useState({});
    const [suggestLang, setSuggestLang] = useState({});
    const [metadatLanguage, setMetadataLanguage] = useState([]);
    const [metadatSoftskills, setMetadataSoftskills] = useState([]);
    const [metadatHardskills, setMetadataHardskills] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-annonces/" + id).then((res) => {
            setAnnonce(res.data.annonce);
            setHardskills(res.data.hardskills);
            setLanguages(res.data.languages);
            setSoftskills(res.data.softskills);
            setCertificate(res.data.certificates);
            setIsLoading(false)
        });
    }, [id])
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/get-metatda").then(response => {
            setMetadataHardskills(response.data.hardskills)
            setMetadataLanguage(response.data.languages)
            setMetadataSoftskills(response.data.softskills)
            setIsLoading(false)
        })
    }, [])
    function handleData(e){
        setAnnonce(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    function handleDataCertificate(event, index){
        let data = [...certificate];
        data[index][event.target.name] = event.target.value;
        const updatedArray = certificate.map(item => {
            if (item.id === data[index].id) {
                return { 
                    ...item, 
                    certficates: data[index].certficates
                };
            }
            return item;
        });
        setCertificate(updatedArray);
    }
    function addCertificate(){
        setCertificate([...certificate, {certficates :""}],);
    }
    function deleteCertificate(index, id_certificat){
        const list = [...certificate];
        list.splice(index, 1);
        setCertificate(list);
        axios.delete("http://127.0.0.1:8000/api/delete-certificate/" + id_certificat).then((response) => {
            navigate('/recruiter/edit_annonce/' +id, { state: response.data.message })
        })
    }
    function addHardSkill(){
        setHardskills([...hardskills, {hardskills :""}],);
    }
    function deleteHardSkill(index, id_hardskills){
        const list = [...hardskills];
        list.splice(index, 1);
        setHardskills(list);
        axios.delete("http://127.0.0.1:8000/api/delete-hardskills/" + id_hardskills).then((response) => {
            navigate('/recruiter/edit_annonce/' +id, { state: response.data.message })
        })
    }
    function addSoftSkill(){
        setSoftskills([...softskills, {softskills :""}],);
    }
    function deleteSoftSkill(index, id_sofskills){
        const list = [...softskills];
        list.splice(index, 1);
        setSoftskills(list);
        axios.delete("http://127.0.0.1:8000/api/delete-softskills/" + id_sofskills).then((response) => {
            navigate('/recruiter/edit_annonce/' +id, { state: response.data.message })
        })
    }
    function addLanguage(){
        setLanguages([...languages, {language :""}],);
    }
    function deleteLanguage(index, id_language){
        const list = [...languages];
        list.splice(index, 1);
        setLanguages(list);
        axios.delete("http://127.0.0.1:8000/api/delete-language/" + id_language).then((response) => {
            navigate('/recruiter/edit_annonce/' +id, { state: response.data.message })
            navigate(0);
        })
    }
    function handleDataHardSkills(event,index){
        let data = [...hardskills];
        data[index][event.target.name] = event.target.value;
        const updatedArray = hardskills.map(item => {
            if (item.id === data[index].id) {
                return { 
                    ...item, 
                    hardskills : data[index].hardskills
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatHardskills).map((key)=>metadatHardskills[key].hardskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestHard({...suggestHard, [index]: suggestion});
        setHardskills(updatedArray);
    }
    function handleDataSoftSkills(event,index){
        let data = [...softskills];
        data[index][event.target.name] = event.target.value;
        const updatedArray = softskills.map(item => {
            if (item.id === data[index].id) {
                return { 
                    ...item, 
                    softskills : data[index].softskills
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatSoftskills).map((key)=>metadatSoftskills[key].softskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestSoft({...suggestSoft, [index]: suggestion});
        setSoftskills(updatedArray);
    }
    function handleDataLanguage(event, index){
        let data = [...languages];
        data[index][event.target.name] = event.target.value;
        const updatedArray = languages.map(item => {
            if (item.id === data[index].id) {
                return { 
                    ...item, 
                    language : data[index].language
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatLanguage).map((key)=>metadatLanguage[key].language)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestLang({...suggestLang, [index]: suggestion});
        setLanguages(updatedArray);
    }
    function suggestedHard(event, index){
        let data = [...hardskills];
        data[index].hardskills = event.target.innerText;
        setHardskills(data)
        setSuggestHard([]);
    }
    function suggestedSoft(event, index){
        let data = [...softskills];
        data[index].softskills = event.target.innerText;
        setSoftskills(data)
        setSuggestSoft([]);
    }
    function suggestedLang(event, index){
        let data = [...languages];
        data[index].language = event.target.innerText;
        setAnnonce(data)
        setSuggestLang([]);
    }
    function updateData(e){
        e.preventDefault();
        const data = new FormData();
        data.append("job_position", annonce.job_position);
        data.append("job_description", annonce.job_description);
        data.append("annonce_city", annonce.annonce_city);
        data.append("position", annonce.position);
        data.append("study", annonce.study);
        data.append("contract", annonce.contract);
        data.append("experience", annonce.experience);
        data.append("salary", annonce.salary);
        data.append("certif",JSON.stringify(certificate));
        data.append("soft", JSON.stringify(softskills));
        data.append("hard", JSON.stringify(hardskills));
        data.append("lang", JSON.stringify(languages));
        axios.post("http://127.0.0.1:8000/api/update-annonce/"+id, data).then(response => {
            if (response.data.status === 200) {
                navigate('/recruiter/annonces', { state: response.data.message })
                navigate(0);
            }
        })
    }
    return(
        <div className="container">
            {tokenRe ? 
                <>
                {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                <div className="containter mt-5">
                    <h1 className="text-center mt-5">Modifier l'annonce {annonce.job_position}</h1>
                    {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                    <form onSubmit={updateData}>
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
                                {/* <div className="text-danger">{annonce.errors.job_position}</div> */}
                            </div>
                            <div className="form-floating mb-3 col-md-5">
                                <input
                                    type="text"
                                    name="annonce_city"
                                    className="form-control"
                                    id="floatingCity"
                                    placeholder="city"
                                    onChange={handleData}
                                    value={annonce.annonce_city} 
                                />
                                <label htmlFor="floatingCity" className="ps-4">Ville</label>
                                {/* <div className="text-danger">{annonce.errors.annonce_city}</div> */}
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
                                    value={annonce.position} 
                                />
                                <label htmlFor="floatingPosition" className="ps-4">N° de Poste</label>
                                {/* <div className="text-danger">{annonce.errors.position}</div> */}
                            </div>
                            <div className="col-md-6 mb-3">
                                <select
                                    className="form-select padding-input"
                                    aria-label=".form-select-lg example"
                                    name="study"
                                    onChange={handleData}
                                    value={annonce.study}
                                >
                                    <option value="Bac">Bac</option>
                                    <option value="Bac +2">Bac +2</option>
                                    <option value="Licence">Licence</option>
                                    <option value="Master">Master</option>
                                    <option value="Pas important">Pas important</option>
                                </select>
                                {/* <div className="text-danger">{annonce.errors.study}</div> */}
                            </div>
                            <div className="mb-3 col-md-6 mb-3">
                                {certificate.map((input, index) => {
                                    return (
                                        <>
                                            <div className="row align-items-center" key={index}>
                                                <div className="form-floating col-md-9 mb-3">
                                                    <input
                                                        type="text"
                                                        name="certficates"
                                                        className="form-control"
                                                        id="floatingcertficate"
                                                        placeholder="fields"
                                                        onChange={event => handleDataCertificate(event, index)}
                                                        value={input.certficates} 
                                                    />
                                                    <label htmlFor="floatingcertficate" className="ps-4">Diplôme #{index + 1}</label>
                                                    {/* <div className="text-danger">{annonce.errors.certificate}</div> */}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <div className={certificate.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                        <div>
                                                            <button
                                                                className="btn btn-success fs-4 border px-3"
                                                                type="button"
                                                                onClick={addCertificate}
                                                            >
                                                                <i className="fa-solid fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        {certificate.length > 1 ?
                                                            <div>
                                                                <button
                                                                    className="btn btn-danger fs-4 border px-3"
                                                                    type="button"
                                                                    onClick={()=>deleteCertificate(index, input.id)}
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
                            <div className="col-md-4">
                                <select
                                    className="form-select padding-input"
                                    aria-label=".form-select-lg example"
                                    name="contract"
                                    onChange={handleData}
                                    value={annonce.contract}
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Contrat anapec">Contrat anapec</option>
                                </select>
                                {/* <div className="text-danger">{annonce.errors.contract}</div> */}
                            </div>
                            <div className="col-md-4 mb-3">
                                <select
                                    className="form-select padding-input"
                                    aria-label=".form-select-lg example"
                                    name="experience"
                                    onChange={handleData}
                                    value={annonce.experience}
                                >
                                    <option value="Debutant">Débutant</option>
                                    <option value="Intermediaire">Intérmediaire</option>
                                    <option value="Expert">Expert</option>
                                </select>
                                {/* <div className="text-danger">{annonce.errors.experience}</div> */}
                            </div>
                            <div className="form-floating mb-3 col-md-4">
                                <input
                                    type="text"
                                    name="salary"
                                    className="form-control"
                                    id="floatingSalary"
                                    placeholder="salary"
                                    onChange={handleData}
                                    value={annonce.salary} 
                                />
                                <label htmlFor="floatingSalary" className="ps-4">Salaire</label>
                                {/* <div className="text-danger">{annonce.errors.salary}</div> */}
                            </div>
                            <div className="mb-3 col-md-6">
                                {hardskills.map((input, index) => {
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
                                                        placeholder="hardskills"
                                                        onChange={event => handleDataHardSkills(event, index)}
                                                        value={input.hardskills} 
                                                    />
                                                    <label htmlFor={index} className="ps-4">Compténce technique #{index + 1}</label>
                                                    {/* <div className="text-danger">{annonce.errors.hardskills}</div> */}
                                                    {suggestHard[index] &&
                                                    <div id={'data_hard' + index} 
                                                        className="bg-white w-100 shadow pointer rounded-bottom"
                                                    >
                                                        {suggestHard[index].map((value, key)=>{
                                                            return(
                                                                    <>
                                                                        <li
                                                                            className="ps-3 py-2 border-bottom li-style"
                                                                            value={value} 
                                                                            onClick={(event)=> suggestedHard(event, index)}
                                                                        >{value}
                                                                        </li>
                                                                    </>
                                                                )
                                                            })}
                                                        </div>}
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <div className={hardskills.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                            <div>
                                                                <button
                                                                    className="btn btn-success fs-4 border px-3"
                                                                    type="button"
                                                                    onClick={addHardSkill}
                                                                >
                                                                    <i className="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            {hardskills.length > 1 ?
                                                                <div>
                                                                    <button
                                                                        className="btn btn-danger fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={()=>deleteHardSkill(index, input.id)}
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
                                <div className="mb-3 col-md-6">
                                    {softskills.map((input, index) => {
                                        return (
                                            <>
                                                <div className="row align-items-center" key={index}>
                                                    <div className="form-floating col-md-9 mb-3">
                                                        <input
                                                            type="text"
                                                            name="softskills"
                                                            className="form-control"
                                                            list={"data_soft" + index}
                                                            placeholder="softskills"
                                                            onChange={event => handleDataSoftSkills(event, index)}
                                                            value={input.softskills} 
                                                        />
                                                        <label htmlFor="floatingsoftkills" className="ps-4">Compténce personnelle #{index + 1}</label>
                                                        {/* <div className="text-danger">{annonce.errors.softskills}</div> */}
                                                        {suggestSoft[index] &&
                                                        <div id={'data_soft' + index} 
                                                            className="bg-white w-100 shadow pointer rounded-bottom"
                                                        >
                                                            {suggestSoft[index].map((value, key)=>{
                                                                return(
                                                                    <>
                                                                        <li
                                                                            className="ps-3 py-2 border-bottom li-style"
                                                                            value={value} 
                                                                            onClick={(event)=> suggestedSoft(event, index)}
                                                                        >{value}
                                                                        </li>
                                                                    </>
                                                                )
                                                            })}
                                                        </div>}
                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <div className={softskills.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                            <div>
                                                                <button
                                                                    className="btn btn-success fs-4 border px-3"
                                                                    type="button"
                                                                    onClick={addSoftSkill}
                                                                >
                                                                    <i className="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            {softskills.length > 1 ?
                                                                <div>
                                                                    <button
                                                                        className="btn btn-danger fs-4 border px-3"
                                                                        type ="button"
                                                                        onClick={()=>deleteSoftSkill(index, input.id)}
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
                                <div className="mb-3 col-md-12">
                                    {languages.map((input, index) => {
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
                                                            value={input.language} 
                                                        />
                                                        <label htmlFor="floatinglanguage" className="ps-4">Langues #{index + 1}</label>
                                                        {/* <div className="text-danger">{annonce.errors.language}</div> */}
                                                        {suggestLang[index] &&
                                                        <div id={'data_lang' + index} 
                                                            className="bg-white w-100 shadow pointer rounded-bottom"
                                                        >
                                                            {suggestLang[index].map((value, key)=>{
                                                                return(
                                                                    <>
                                                                        <li
                                                                            className="ps-3 py-2 border-bottom li-style"
                                                                            value={value} 
                                                                            onClick={(event)=> suggestedLang(event, index)}
                                                                        >{value}
                                                                        </li>
                                                                    </>
                                                                )
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
                                                            {input.id ?
                                                                <>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option>
                                                                </> :
                                                                <>
                                                                <option value="">---Niveau Lu---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option></> 
                                                            }
                                                        </select>
                                                        {/* <div className="text-danger">{annonce.errors.read}</div> */}
                                                    </div>
                                                    <div className="col-md-2">
                                                        <select
                                                            className="form-select padding-input"
                                                            aria-label=".form-select-lg example"
                                                            name="written"
                                                            onChange={event => handleDataLanguage(event, index)}
                                                            value={input.written}
                                                        >
                                                            {input.id ?
                                                                <>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option>
                                                                </> :
                                                                <>
                                                                <option value="">---Niveau Ecrit---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option></> 
                                                            }
                                                        </select>
                                                        {/* <div className="text-danger">{annonce.errors.written}</div> */}
                                                    </div>
                                                    <div className="col-md-2">
                                                        <select
                                                            className="form-select padding-input"
                                                            aria-label=".form-select-lg example"
                                                            name="spoken"
                                                            onChange={event => handleDataLanguage(event, index)}
                                                            value={input.spoken}
                                                        >
                                                            {input.id ?
                                                                <>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option>
                                                                </> :
                                                                <>
                                                                <option value="">---Niveau Parlé---</option>
                                                                <option value="Debutant">Débutant</option>
                                                                <option value="Intermediaire">Intérmedaire</option>
                                                                <option value="Avance">Avancé</option></> 
                                                            }
                                                        </select>
                                                        {/* <div className="text-danger">{annonce.errors.spoken}</div> */}
                                                    </div>
                                                    <div className="col-md-2 mb-3 mt-1">
                                                        <div className={languages.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                            <div>
                                                                <button
                                                                    className="btn btn-success fs-4 border px-3"
                                                                    type="button"
                                                                    onClick={addLanguage}
                                                                >
                                                                    <i className="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            {languages.length > 1 ?
                                                                <div>
                                                                    <button
                                                                        className="btn btn-danger fs-4 border px-3"
                                                                        type="button"
                                                                        onClick={()=>deleteLanguage(index, input.id)}
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
                                    {/* <div className="text-danger">{annonce.errors.job_description}</div> */}
                                </div>
                                <div className="col-md-12 text-center my-4">
                                    <button className="btn btn-primary px-5 py-2 fs-5">Enregistrer annonce</button>
                                </div>
                        </div>
                    </form>
                </div>}
                </> :
                <Navigate to="/login"/>
            }
        </div>
    )
}