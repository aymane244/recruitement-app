import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function EspaceCV() {
    const navigate = useNavigate();
    let image_profil;
    let limit = 190;
    const [resume, setResume] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    // let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let options = { year: 'numeric', month: 'long'};
    const {candidate, apiCandidate, tokenCa} = useContext(Auth)
    const [database, setDatabase] = useState([]);
    const [carcater, setCaracter] = useState(0 || localStorage.getItem('saved'));
    if(candidate.id){
        localStorage.setItem('saved', carcater)
    }
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [harskills, setHardSkills] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [image, setImage] = useState("")
    const [metadatLanguage, setMetadataLanguage] = useState([]);
    const [metadatSoftskills, setMetadataSoftskills] = useState([]);
    const [metadatHardskills, setMetadataHardskills] = useState([]);
    const [suggestHard, setSuggestHard] = useState({});
    const [suggestSoft, setSuggestSoft] = useState({});
    const [suggestLang, setSuggestLang] = useState({});
    const [suggestHardUpdate, setSuggestHardUpdate] = useState({});
    const [suggestSoftUpdate, setSuggestSoftUpdate] = useState({});
    const [suggestLangUpdate, setSuggestLangUpdate] = useState({});
    const [profil, setProfil] = useState({
        profil : '',
    })
    const [fillResume, setFillResume] = useState({
        summuray : '',
        email : '',
        phone : '',
        fname : '',
        lname : '',
        birthday : '',
        candidate_adress : '',
        soft : [{
            softskills: '',
        }],
        hard : [{
            hardskills: '',
        }],
        lang : [{
            languages: '',
            read: '',
            written: '',
            spoken: '',
        }],
        hobb : [{
            hobbies: '',
        }],
        education : [{
            education_date : '',
            certificate : '',
            school : '',
        }],
        experience : [{
            tasks : '',
            entreprise : '',
            experience_country : '',
            experience_city : '',
            position : '',
            date_begin : '',
            date_end : '',
        }],
        errors : [],
    })
    useEffect(() => {
        async function getResume() {
            const cv = await apiCandidate.get('/api/get-profil');
            setDatabase(cv.data.message)
            setResume(cv.data.resume[0])
            setEducation(cv.data.eductaions)
            setExperience(cv.data.experiences)
            setHardSkills(cv.data.hardSkills)
            setHobbies(cv.data.hobbies)
            setLanguages(cv.data.languages)
            setSoftSkills(cv.data.softSkills)
            setIsLoading(false);
        }
        getResume()
    }, [])
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/get-metatda").then(response => {
            setMetadataHardskills(response.data.hardskills)
            setMetadataLanguage(response.data.languages)
            setMetadataSoftskills(response.data.softskills)
            setIsLoading(false)
        })
    }, [])
    function handleData(event){
        setProfil(formData=>({
            ...formData,
            profil : event.target.value
        }))
    }
    function sendData(e){
        e.preventDefault()
        const data ={
            profil : profil.profil,
            profil_id : candidate.id
        }
        axios.post("http://127.0.0.1:8000/api/create-profil", data).then(response => {
            if (response.data.status === 200) {
                navigate(0);
            }
        })
    }
    if(candidate.photo === null){
        image_profil = <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/>
    }else{
        image_profil = <img src={"http://127.0.0.1:8000/storage/"+candidate.photo} alt="profile" className="profile-img rounded-circle"/>
    }
    function getAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const months = new Set();
    const monthsvalue = new Set();
    function m1900(yyyymmdd) {
        const [_, y, m, d] = yyyymmdd.match(/^(\d{4})-(\d{2})-(\d{2})$/).map(Number);
        return (y - 1900) * 12 + m;
    }
    experience.forEach(job=>{
        const m1 = m1900(job.date_begin);
        const m2 = m1900(job.date_end);
        for (let m = m1; m < m2; m++) months.add(m);
    })
    fillResume.experience.forEach(job=>{
        const m1 = m1900(job.date_begin || today);
        const m2 = m1900(job.date_end || today);
        for (let m = m1; m < m2; m++) monthsvalue.add(m);
    })
    function handleDataResume(event){
        setFillResume(formData=>({
            ...formData,
            [event.target.name] : event.target.value,
        }))
    }
    function handleSingleData(event){
        setFillResume(formData=>({
            ...formData,
            summuray : event.target.value,
        }))
        setCaracter(event.target.value.length)
    }
    function handleDataSoftSkills(index,event){
        let data = [...fillResume.soft];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            // suggestion = Object.keys(metadatSoftskills).map((key)=>metadatSoftskills[key].softskills)
            suggestion = metadatSoftskills.map((key)=>key.softskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestSoft({...suggestSoft, [index]: suggestion});
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            soft : data,
        }))   
    }
    function handleUpadetDataSoftSkills(event, index){
        const updatedArray = softSkills.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    softskills : event.target.value
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = Object.keys(metadatSoftskills).map((key)=>metadatSoftskills[key].softskills)
            suggestion = metadatSoftskills.map((key)=>key.softskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestSoftUpdate({...suggestSoftUpdate, [index]: suggestion});
        setSoftSkills(updatedArray);
    }
    function addSoftSkill(){
        setFillResume({
            ...fillResume,
            soft: [...fillResume.soft, { softskills: "" }],
          });
    }
    function deleteSoftSkill(index){
        const list = [...fillResume.soft];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            soft: list,
        });
    }
    function deleteSoftSkillUpdated(index, id){
        const list = [...softSkills];
        list.splice(index, 1);
        setSoftSkills(list);
        axios.delete("http://127.0.0.1:8000/api/delete-softskillsCandidate/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function handleDataHardSkills(index,event){
        let data = [...fillResume.hard];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = metadatHardskills.map((key)=>key.hardskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestHard({...suggestHard, [index]: suggestion});
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            hard : data,
        }))
    }
    function handleDataHardSkillsUpdated(event, index){
        const updatedArray = harskills.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    hardskills : event.target.value
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = metadatHardskills.map((key)=>key.hardskills)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestHardUpdate({...suggestHardUpdate, [index]: suggestion});
        setHardSkills(updatedArray);
    }
    function addHardSkill(){
        setFillResume({
            ...fillResume,
            hard: [...fillResume.hard, { hardskills: "" }],
          });
    }
    function deleteHardSkill(index){
        const list = [...fillResume.hard];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            hard: list,
        });
    }
    function deleteHardSkillUpdated(index, id){
        const list = [...harskills];
        list.splice(index, 1);
        setHardSkills(list);
        axios.delete("http://127.0.0.1:8000/api/delete-hardkillsCandidate/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function handleDataLanguage(index,event){
        let data = [...fillResume.lang];
        data[index][event.target.name] = event.target.value;
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = metadatLanguage.map((key)=>key.language)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestLang({...suggestLang, [index]: suggestion});
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            lang : data,
        }))
    }
    function handleDataLanguageudapted(event, index){
        const updatedArray = languages.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    language : event.target.value,
                };
            }
            return item;
        });
        let suggestion = [];
        if(event.target.value.length > 0){
            suggestion = metadatLanguage.map((key)=>key.language)
            // suggestion = Object.keys(metadatLanguage).map((key)=>metadatLanguage[key].language)
            .sort()
            .filter((e)=>e.toLowerCase().startsWith(event.target.value.toLowerCase()))
        }
        setSuggestLangUpdate({...suggestLangUpdate, [index]: suggestion});
        setLanguages(updatedArray);
    }
    function handleDataReadudapted(event){
        const updatedArray = languages.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    read : event.target.value,
                };
            }
            return item;
        });
        setLanguages(updatedArray);
    }
    function handleDataWrittenudapted(event){
        const updatedArray = languages.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    written : event.target.value,
                };
            }
            return item;
        });
        setLanguages(updatedArray);
    }
    function handleDataSpokenudapted(event){
        const updatedArray = languages.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    spoken : event.target.value,
                };
            }
            return item;
        });
        setLanguages(updatedArray);
    }
    function addLanguage(){
        setFillResume({
            ...fillResume,
            lang: [...fillResume.lang, { languages: "" }],
          });
    }
    function deleteLanguage(index){
        const list = [...fillResume.lang];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            lang: list,
        });
    }
    function deleteLanguageUpdated(index, id){
        const list = [...languages];
        list.splice(index, 1);
        setLanguages(list);
        axios.delete("http://127.0.0.1:8000/api/delete-languageCandidate/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function handleHobby(index,event){
        let data = [...fillResume.hobb];
        data[index][event.target.name] = event.target.value;
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            hobb : data,
        }))
    }
    function handleHobbyupdated(event){
        const updatedArray = hobbies.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    hobbie : event.target.value
                };
            }
            return item;
        });
        setHobbies(updatedArray);
    }
    function addHobby(){
        setFillResume({
            ...fillResume,
            hobb: [...fillResume.hobb, { hobbies: "" }],
          });
    }
    function deleteHobby(index){
        const list = [...fillResume.hobb];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            hobb: list,
        });
    }
    function deleteHobbyUpdated(index, id){
        const list = [...hobbies];
        list.splice(index, 1);
        setHobbies(list);
        axios.delete("http://127.0.0.1:8000/api/delete-hobbies/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function handleEducationData(index, event) {
        let data = [...fillResume.education];
        data[index][event.target.name] = event.target.value;
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            education: data,
        }))
    }
    function handleEducationDateDataupdated(event){
        const updatedArray = education.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    education_date : event.target.value,
                };
            }
            return item;
        });
        setEducation(updatedArray);
    }
    function handleSchoolDataupdated(event){
        const updatedArray = education.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    school : event.target.value,
                };
            }
            return item;
        });
        setEducation(updatedArray);
    }
    function handlecertfifcateDataupdated(event){
        const updatedArray = education.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    certificate : event.target.value,
                };
            }
            return item;
        });
        setEducation(updatedArray);
    }
    function addEducation(){
        setFillResume({
            ...fillResume,
            education: [...fillResume.education, { 
                    education_date : '',
                    certificate : '',
                    school : '',
                }],
          });
    }
    function deleteEducation(index){
        const list = [...fillResume.education];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            education: list,
        });
    }
    function deleteEducationUpdated(index, id){
        const list = [...education];
        list.splice(index, 1);
        setEducation(list);
        axios.delete("http://127.0.0.1:8000/api/delete-education/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function handleExperienceData(index, event) {
        let data = [...fillResume.experience];
        data[index][event.target.name] = event.target.value;
        setFillResume(formData => ({
            ...formData,
            [event.target.name]: event.target.value,
            experience: data,
        }))
    }
    function handleExperienceEntrepriseData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    entreprise : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperienceCountryData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    experience_country : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperienceCityData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    experience_city : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperiencePositionData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    position : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperienceDateBeginData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    date_begin : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperienceDateEndData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    date_end : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function handleExperienceTasksData(event){
        const updatedArray = experience.map(item => {
            if (item.id === parseInt(event.target.name)) {
                return { 
                    ...item, 
                    tasks : event.target.value,
                };
            }
            return item;
        });
        setExperience(updatedArray);
    }
    function addExperience(){
        setFillResume({
            ...fillResume,
            experience: [...fillResume.experience, { 
                entreprise : '',
                experience_country : '',
                experience_city : '',
                position : '',
                date_begin : '',
                date_end : '',
                tasks : '',
            }],
        });
    }
    function deleteExperience(index){
        const list = [...fillResume.experience];
        list.splice(index, 1);
        setFillResume({
            ...fillResume,
            experience: list,
        });
    }
    function deleteExperienceUpdated(index, id){
        const list = [...experience];
        list.splice(index, 1);
        setExperience(list);
        axios.delete("http://127.0.0.1:8000/api/delete-experience/" + id).then((response) => {
            navigate('/candidate/cv/', { state: response.data.message })
            navigate(0);
        })
    }
    function suggestedHard(event, index){
        let data = [...fillResume.hard];
        let item = {...data[index]};
        item.hardskills = event.target.innerText;
        data[index] = item
        setFillResume(formData => ({
            ...formData,
            hard : data,
        }))
        setSuggestHard([]);
    }
    function suggestedSoft(event, index){
        let data = [...fillResume.soft];
        let item = {...data[index]};
        item.softskills = event.target.innerText;
        data[index] = item
        setFillResume(formData => ({
            ...formData,
            soft : data,
        }))
        setSuggestSoft([]);
    }
    function suggestedLang(event, index){
        let data = [...fillResume.lang];
        let item = {...data[index]};
        item.languages = event.target.innerText;
        data[index] = item
        setFillResume(formData => ({
            ...formData,
            lang : data,
        }))
        setSuggestLang([]);
    }
    function suggestedLangUpdate(event, index){
        let data = [...languages];
        data[index].languages = event.target.innerText;
        setLanguages(data)
        setSuggestLangUpdate([]);
    }
    function suggestedHardUpdated(event, index){
        let data = [...harskills];
        data[index].hardskills = event.target.innerText;
        setHardSkills(data)
        setSuggestHardUpdate([]);
    }
    function suggestedSoftUpdated(event, index){
        let data = [...softSkills];
        data[index].softskills = event.target.innerText;
        setSoftSkills(data)
        setSuggestSoftUpdate([]);
    }
    console.log((Number(months.size / 12) + Number(monthsvalue.size / 12)).toFixed(1))
    function createResume(e){
        e.preventDefault();
        const data = new FormData();
        data.append("profil", fillResume.profil || resume.profil);
        data.append("summuray", fillResume.summuray || resume.summuray);
        data.append("email", fillResume.email || candidate.email);
        data.append("phone", fillResume.phone || candidate.phone);
        data.append("fname", fillResume.fname || candidate.fname);
        data.append("lname", fillResume.lname || candidate.lname);
        data.append("birthday", fillResume.birthday || candidate.birthday);
        data.append("candidate_adress", fillResume.candidate_adress || candidate.candidate_adress);
        data.append("image", candidate.photo || image);
        data.append("years_experience", (Number(months.size / 12) + Number(monthsvalue.size / 12)).toFixed(1));
        data.append("softskills", JSON.stringify(fillResume.soft));
        for(let i = 0; i<fillResume.soft.length; i++){
            data.append("softskill", fillResume.soft[i].softskills);
        }
        data.append("hardskills", JSON.stringify(fillResume.hard));
        for(let i = 0; i<fillResume.hard.length; i++){
            data.append("hardskill", fillResume.hard[i].hardskills);
        }
        data.append("languages", JSON.stringify(fillResume.lang));
        for(let i =0; i< fillResume.lang.length; i++){
            data.append("language", fillResume.lang[i].languages);
        }
        data.append("hobbies", JSON.stringify(fillResume.hobb));
        for(let i =0; i< fillResume.hobb.length; i++){
            data.append("hobbie", fillResume.hobb[i].hobbies);
        }
        data.append("education", JSON.stringify(fillResume.education));
        for(let i =0; i< fillResume.education.length; i++){
            data.append("education_date", fillResume.education[i].education_date);
            data.append("certificate", fillResume.education[i].certificate);
            data.append("school", fillResume.education[i].school);
        }
        data.append("experience", JSON.stringify(fillResume.experience));
        for(let i =0; i<fillResume.experience.length; i++){
            data.append("tasks", fillResume.experience[i].tasks);
            data.append("entreprise", fillResume.experience[i].entreprise);
            data.append("experience_country", fillResume.experience[i].experience_country);
            data.append("experience_city", fillResume.experience[i].experience_city);
            data.append("position", fillResume.experience[i].position);
            data.append("date_begin", fillResume.experience[i].date_begin);
            data.append("date_end", fillResume.experience[i].date_end);
        }
        data.append("candidate", candidate.id);
        data.append("sof_update", JSON.stringify(softSkills));
        data.append("hard_update", JSON.stringify(harskills));
        data.append("lang_update", JSON.stringify(languages));
        data.append("hobby_update", JSON.stringify(hobbies));
        data.append("education_update", JSON.stringify(education));
        data.append("experience_update", JSON.stringify(experience));
        for(let i =0; i< softSkills.length; i++){
            data.append("soft_id", softSkills[i].id);
        }
        axios.post("http://127.0.0.1:8000/api/create-resume", data).then(response => {
            navigate('/candidate/CV', { state: response.data.message })
            navigate(0);
        })
    }
    console.log(database)
    return (
        <div className="mt-5">
            {tokenCa ?
                <>
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <div>
                        {database === "empty" ?
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-md-6 shadow border rounded px-4">
                                        <form onSubmit={sendData}>
                                            <h4 className="text-center py-3">Veuillez saisir votre profil</h4>
                                            <div className="form-floating mb-3 col-md-12">
                                                <input
                                                    type="text"
                                                    name="profil"
                                                    className="form-control"
                                                    id="floatingprofil"
                                                    onChange={handleData}
                                                    value={profil.profil}
                                                    placeholder=" "
                                                />
                                                <label htmlFor="floatingprofil" className="ps-4">Votre profil</label>
                                            </div>
                                            <div className="col-md-12 text-center my-4">
                                                <button className="btn btn-primary px-5 py-2 fs-5">Valider</button>
                                            </div>
                                        </form>
                                    </div>
                                </div> 
                            </div>:
                            <>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-12">
                                        {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <form onSubmit={createResume}>
                                                <div class="mb-3">
                                                    <label for="profil" class="form-label">Profil</label>
                                                    <input 
                                                        type="text" 
                                                        class="form-control" 
                                                        id="profil"
                                                        name="profil"
                                                        onChange={handleDataResume}
                                                        value={fillResume.profil || resume.profil}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label for="summuray" class="form-label">Profil</label>
                                                    <textarea
                                                        name="summuray"
                                                        className="form-control"
                                                        placeholder="Décrire votre parcours profesionnel"
                                                        rows="6"
                                                        onChange={handleSingleData}
                                                        value={fillResume.summuray.slice(0, limit -1) || resume.summuray}
                                                    >
                                                    </textarea>
                                                    <div className="mb-3 d-flex justify-content-between">
                                                        <p>Maximum {limit} Caractères</p>
                                                        <p style={carcater >= (limit - 10) ? {color : 'red'} : {color : 'black'}}>{candidate.id && carcater} Caractère écris</p>
                                                    </div>
                                                </div>
                                                <div className="input-group mb-3">
                                                    <input 
                                                        type="file" 
                                                        name="image"
                                                        className="form-control" 
                                                        id="inputGroupFile02"
                                                        onChange={(event) => event.target.files[0].name.split('.').pop() === ("jpg" || "png" || "jpeg") ? setImage(event.target.files[0]) : alert("Juste les fichiers de type png, jpg ou jpeg sont acceptés")}
                                                    />
                                                    <label className="input-group-text" for="inputGroupFile02">Photo</label>
                                                </div>
                                                <div class="accordion" id="accordionExample">
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingOne">
                                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                Coordonnées
                                                            </button>
                                                        </h2>
                                                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                <div class="mb-3">
                                                                    <label for="fname" class="form-label">Prénom</label>
                                                                    <input 
                                                                        type="text" 
                                                                        class="form-control" 
                                                                        id="fname"
                                                                        name="fname"
                                                                        onChange={handleDataResume}
                                                                        value={fillResume.fname || candidate.fname}
                                                                    />
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="lname" class="form-label">Nom</label>
                                                                    <input 
                                                                        type="text" 
                                                                        class="form-control" 
                                                                        id="lname"
                                                                        name="lname"
                                                                        onChange={handleDataResume}
                                                                        value={fillResume.lname || candidate.lname}
                                                                    />
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="birthday" class="form-label">Date de naissance</label>
                                                                    <input 
                                                                        type="date" 
                                                                        class="form-control" 
                                                                        id="birthday"
                                                                        name="birthday"
                                                                        onChange={handleDataResume}
                                                                        value={fillResume.birthday || candidate.birthday}
                                                                    />
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="email" class="form-label">Email</label>
                                                                    <input 
                                                                        type="email" 
                                                                        class="form-control" 
                                                                        id="email"
                                                                        name="email"
                                                                        value={fillResume.email || candidate.email}
                                                                        onChange={handleDataResume}
                                                                    />
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="phone" class="form-label">N° de Téléphone</label>
                                                                    <input 
                                                                        type="text" 
                                                                        class="form-control" 
                                                                        id="phone"
                                                                        name="phone"
                                                                        value={fillResume.phone || candidate.phone}
                                                                        onChange={handleDataResume}
                                                                    />
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="adresse" class="form-label">Adresse</label>
                                                                    <input 
                                                                        type="text" 
                                                                        class="form-control" 
                                                                        id="adresse"
                                                                        name="candidate_adress"
                                                                        value={fillResume.candidate_adress || candidate.candidate_adress}
                                                                        onChange={handleDataResume}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingTwo">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                Compétences personelles
                                                            </button>
                                                        </h2>
                                                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {softSkills && softSkills.map((item, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center">
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    key={item.id}
                                                                                    name={item.id}
                                                                                    className="form-control"
                                                                                    id="floatingsoft_skills_update"
                                                                                    placeholder="soft skills"
                                                                                    list={'data_soft_update' + index}
                                                                                    value={item.softskills}
                                                                                    onChange={event => handleUpadetDataSoftSkills(event, index)}
                                                                                />
                                                                                <label htmlFor="floatingsoft_skills_update" className="ps-4">Compétences personelles #{index + 1}</label>
                                                                                {suggestSoftUpdate[index] &&
                                                                                    <div id={'data_soft' + index}
                                                                                        className="bg-white w-100 shadow pointer rounded-bottom"
                                                                                    >
                                                                                {suggestSoftUpdate[index].map((value, key) => {
                                                                                        return (
                                                                                            <>
                                                                                                <li
                                                                                                    className="ps-3 py-2 border-bottom li-style"
                                                                                                    value={value}
                                                                                                    onClick={(event) => suggestedSoftUpdated(event, index)}
                                                                                                >{value}
                                                                                                </li>
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                </div>}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className="text-center">
                                                                                    {softSkills.length > 0 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteSoftSkillUpdated(index, item.id)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>      
                                                                    )
                                                                })}
                                                                {fillResume.soft.map((skill, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    name="softskills"
                                                                                    className="form-control"
                                                                                    id="floatingsoft_skills"
                                                                                    placeholder="soft skills"
                                                                                    list={'data_soft' + index}
                                                                                    onChange={event => handleDataSoftSkills(index, event)}
                                                                                    value={skill.softskills}
                                                                                />
                                                                                <label htmlFor="floatingsoft_skills" className="ps-4">Compétences personelles #{index + 1}</label>
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
                                                                                <div className={fillResume.soft.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-success fs-4 border px-3"
                                                                                            type="button"
                                                                                            onClick={addSoftSkill}
                                                                                        >
                                                                                            <i className="fa-solid fa-plus"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                    {fillResume.soft.length > 1 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteSoftSkill(index)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingThree">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                Compétences techniques
                                                            </button>
                                                        </h2>
                                                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {harskills && harskills.map((value, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    name={value.id}
                                                                                    className="form-control"
                                                                                    id="floatinghard_skills"
                                                                                    placeholder="hard_skills"
                                                                                    list={'data_hard_update' + index}
                                                                                    onChange={event=> handleDataHardSkillsUpdated(event, index)}
                                                                                    value={value.hardskills}
                                                                                />
                                                                                <label htmlFor="floatinghard_skills" className="ps-4">Compétences techniques #{index + 1}</label>
                                                                                {suggestHardUpdate[index] &&
                                                                                    <div id={'data_hard' + index}
                                                                                        className="bg-white w-100 shadow pointer rounded-bottom"
                                                                                    >
                                                                                    {suggestHardUpdate[index].map((value, i) => {
                                                                                        return (
                                                                                            <>
                                                                                                <li
                                                                                                    className="ps-3 py-2 border-bottom li-style"
                                                                                                    value={value}
                                                                                                    onClick={(event) => suggestedHardUpdated(event, index)}
                                                                                                >{value}
                                                                                                </li>
                                                                                            </>
                                                                                        );
                                                                                    })}
                                                                                </div>}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className="text-center">
                                                                                    {harskills.length > 0 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteHardSkillUpdated(index, value.id)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                                {fillResume.hard.map((skill, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    name="hardskills"
                                                                                    className="form-control"
                                                                                    id="floatinghard_skills"
                                                                                    placeholder="hard_skills"
                                                                                    list = {'data_hard' + index}
                                                                                    onChange={event => handleDataHardSkills(index, event)}
                                                                                    value={skill.hardskills}
                                                                                />
                                                                                <label htmlFor="floatinghard_skills" className="ps-4">Compétences techniques #{index + 1}</label>
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
                                                                                <div className={fillResume.hard.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-success fs-4 border px-3"
                                                                                            type="button"
                                                                                            onClick={addHardSkill}
                                                                                        >
                                                                                            <i className="fa-solid fa-plus"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                    {fillResume.hard.length > 1 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteHardSkill(index)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingFour">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseLang" aria-expanded="false" aria-controls="collapseLang">
                                                                Langues
                                                            </button>
                                                        </h2>
                                                        <div id="collapseLang" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {languages && languages.map((value, key)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={key}>
                                                                            <div className="form-floating col-md-9 mb-3 me-4">
                                                                                <input
                                                                                    type="text"
                                                                                    name={value.id}
                                                                                    className="form-control"
                                                                                    id="floatinglanguages"
                                                                                    placeholder="languages"
                                                                                    list={'data_lang_update' + key}
                                                                                    onChange={event => handleDataLanguageudapted(event, key)}
                                                                                    value={value.language}
                                                                                />
                                                                                <label htmlFor="floatinglanguages" className="ps-4">Langues #{key + 1}</label>
                                                                                {suggestLangUpdate[key] &&
                                                                                    <div id={'data_lang' + key}
                                                                                        className="bg-white w-100 shadow pointer rounded-bottom"
                                                                                    >
                                                                                        {suggestLangUpdate[key].map((value, i) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <li
                                                                                                        className="ps-3 py-2 border-bottom li-style"
                                                                                                        value={value}
                                                                                                        onClick={(event) => suggestedLangUpdate(event, key)}
                                                                                                    >{value}
                                                                                                    </li>
                                                                                                </>
                                                                                            );
                                                                                        })}
                                                                                </div>}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <select
                                                                                    className="form-select padding-input"
                                                                                    aria-label=".form-select-lg example"
                                                                                    name={value.id}
                                                                                    onChange={handleDataReadudapted}
                                                                                    value={value.read} 
                                                                                >
                                                                                    <option value={value.read} >{
                                                                                        (value.read === "Avance" ? "Avancé" : "") || (value.read === "Intermediaire" ? "Intermédiaire" : "")
                                                                                        || (value.read === "Debutant" ? "Débutant" : "")
                                                                                    } </option>
                                                                                    {
                                                                                        value.read === "Debutant" ? 
                                                                                        <>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Intermediaire" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Avance" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                        </> : ''
                                                                                    }
                                                                                </select>
                                                                                {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <select
                                                                                    className="form-select padding-input"
                                                                                    aria-label=".form-select-lg example"
                                                                                    name={value.id}
                                                                                    onChange={handleDataWrittenudapted}
                                                                                    value={value.written}
                                                                                >
                                                                                    <option value={value.read} >{
                                                                                        (value.read === "Avance" ? "Avancé" : "") || (value.read === "Intermediaire" ? "Intermédiaire" : "")
                                                                                        || (value.read === "Debutant" ? "Débutant" : "")
                                                                                    } </option>
                                                                                    {
                                                                                        value.read === "Debutant" ? 
                                                                                        <>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Intermediaire" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Avance" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                        </> : ''
                                                                                    }
                                                                                </select>
                                                                                {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <select
                                                                                    className="form-select padding-input"
                                                                                    aria-label=".form-select-lg example"
                                                                                    name={value.id}
                                                                                    onChange={handleDataSpokenudapted}
                                                                                    value={value.spoken}
                                                                                >
                                                                                    <option value={value.read} >{
                                                                                        (value.read === "Avance" ? "Avancé" : "") || (value.read === "Intermediaire" ? "Intermédiaire" : "")
                                                                                        || (value.read === "Debutant" ? "Débutant" : "")
                                                                                    } </option>
                                                                                    {
                                                                                        value.read === "Debutant" ? 
                                                                                        <>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Intermediaire" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </> 
                                                                                        : value.read === "Avance" ?
                                                                                        <>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                        </> : ''
                                                                                    }
                                                                                </select>
                                                                                {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className="text-center">
                                                                                    {languages.length > 0 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteLanguageUpdated(key, value.id)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>  
                                                                        </div>
                                                                    )
                                                                })}
                                                                {fillResume.lang.map((language, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="col-md-9">
                                                                                <div className="row align-items-center">
                                                                                    <div className="form-floating col-md-12 mb-3">
                                                                                        <input
                                                                                            type="text"
                                                                                            name="languages"
                                                                                            className="form-control"
                                                                                            id="floatinglanguages"
                                                                                            placeholder="languages"
                                                                                            list={'data_lang' + index}
                                                                                            onChange={event => handleDataLanguage(index, event)}
                                                                                            value={language.languages}
                                                                                        />
                                                                                        <label htmlFor="floatinglanguages" className="ps-4">Langues #{index + 1}</label>
                                                                                        {suggestLang[index] &&
                                                                                            <div id={'data_lang' + index}
                                                                                                className="bg-white w-100 shadow pointer rounded-bottom"
                                                                                            >
                                                                                                {suggestLang[index].map((value, i) => {
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
                                                                                    <div className="col-md-4 mb-3">
                                                                                        <select
                                                                                            className="form-select padding-input"
                                                                                            aria-label=".form-select-lg example"
                                                                                            name="read"
                                                                                            onChange={event => handleDataLanguage(index, event)}
                                                                                            value={language.read} 
                                                                                        >
                                                                                            <option value="">Niveau Lu</option>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </select>
                                                                                        {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                                    </div>
                                                                                    <div className="col-md-4 mb-3">
                                                                                        <select
                                                                                            className="form-select padding-input"
                                                                                            aria-label=".form-select-lg example"
                                                                                            name="written"
                                                                                            onChange={event => handleDataLanguage(index, event)}
                                                                                            value={language.written}
                                                                                        >
                                                                                            <option value="">Niveau Ecrit</option>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </select>
                                                                                        {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                                    </div>
                                                                                    <div className="col-md-4 mb-3">
                                                                                        <select
                                                                                            className="form-select padding-input"
                                                                                            aria-label=".form-select-lg example"
                                                                                            name="spoken"
                                                                                            onChange={event => handleDataLanguage(index, event)}
                                                                                            value={language.spoken}
                                                                                        >
                                                                                            <option value="">Niveau Parlé</option>
                                                                                            <option value="Debutant">Débutant</option>
                                                                                            <option value="Intermediaire">Intérmediaire</option>
                                                                                            <option value="Avance">Avancé</option>
                                                                                        </select>
                                                                                        {/* <div className="text-danger">{annonce.errors.study}</div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className={fillResume.lang.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-success fs-4 border px-3"
                                                                                            type="button"
                                                                                            onClick={addLanguage}
                                                                                        >
                                                                                            <i className="fa-solid fa-plus"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                    {fillResume.lang.length > 1 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteLanguage(index)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>       
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingFive">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHob" aria-expanded="false" aria-controls="collapseHob">
                                                                Centres d'intérêts
                                                            </button>
                                                        </h2>
                                                        <div id="collapseHob" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {hobbies && hobbies.map((value, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    name={value.id}
                                                                                    className="form-control"
                                                                                    id="floatinghobbies"
                                                                                    placeholder="hobbies"
                                                                                    onChange={handleHobbyupdated}
                                                                                    value={value.hobbie}
                                                                                />
                                                                                <label htmlFor="floatinghobbies" className="ps-4">Centres d'intérêts #{index + 1}</label>
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className="text-center">
                                                                                    {hobbies.length > 0 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteHobbyUpdated(index, value.id)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )})
                                                                }
                                                                {fillResume.hobb.map((hobby, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center" key={index}>
                                                                            <div className="form-floating col-md-9 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    name="hobbies"
                                                                                    className="form-control"
                                                                                    id="floatinghobbies"
                                                                                    placeholder="hobbies"
                                                                                    onChange={event => handleHobby(index, event)}
                                                                                    value={hobby.hobbies}
                                                                                />
                                                                                <label htmlFor="floatinghobbies" className="ps-4">Centres d'intérêts #{index + 1}</label>
                                                                            </div>
                                                                            <div className="col-md-3 mb-3">
                                                                                <div className={fillResume.hobb.length > 1 ? "d-flex align-items-center" : "text-center"}>
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-success fs-4 border px-3"
                                                                                            type="button"
                                                                                            onClick={addHobby}
                                                                                        >
                                                                                            <i className="fa-solid fa-plus"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                    {fillResume.hobb.length > 1 ?
                                                                                        <div>
                                                                                            <button
                                                                                                className="btn btn-danger fs-4 border px-3"
                                                                                                type ="button"
                                                                                                onClick={() => deleteHobby(index)}
                                                                                            >
                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                            </button>
                                                                                        </div> : ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingSix">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEducation" aria-expanded="false" aria-controls="collapseEducation">
                                                                Formations
                                                            </button>
                                                        </h2>
                                                        <div id="collapseEducation" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {education && education.map((value, index)=>{
                                                                    return(
                                                                        <>
                                                                            <div class="mb-3">
                                                                                <label for="education_date" class="form-label">Date de formation</label>
                                                                                <input
                                                                                    type="date"
                                                                                    class="form-control"
                                                                                    id="education_date"
                                                                                    name={value.id}
                                                                                    onChange={handleEducationDateDataupdated}
                                                                                    value={value.education_date} 
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="certificate_update" class="form-label">Diplôme obtenue</label>
                                                                                <input
                                                                                    type="text"
                                                                                    class="form-control"
                                                                                    id="certificate_update"
                                                                                    name={value.id}
                                                                                    onChange={handlecertfifcateDataupdated}
                                                                                    value={value.certificate} />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="school" class="form-label">Ecole</label>
                                                                                <input
                                                                                    type="text"
                                                                                    class="form-control"
                                                                                    id="school"
                                                                                    name={value.id}
                                                                                    onChange={handleSchoolDataupdated}
                                                                                    value={value.school} />
                                                                            </div>
                                                                            <div className="my-4 d-flex justify-content-around align-items-center">
                                                                                {education.length > 0 ?
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-danger fs-5 border px-3"
                                                                                            type="button"
                                                                                            onClick={() => deleteEducationUpdated(index, value.id)}
                                                                                        >
                                                                                            <i className="fa-solid fa-trash"></i> Supprimer la formation
                                                                                        </button>
                                                                                    </div> : ''
                                                                                }
                                                                            </div>
                                                                            <hr/>
                                                                        </>
                                                                    )
                                                                })}
                                                                {fillResume.education.map((formation, index)=>{
                                                                    return(
                                                                        <>
                                                                            <div class="mb-3">
                                                                                <label for="education_date" class="form-label">Date de formation</label>
                                                                                <input
                                                                                    type="date"
                                                                                    class="form-control"
                                                                                    id="education_date"
                                                                                    name="education_date"
                                                                                    onChange={event => handleEducationData(index, event)}
                                                                                    value={formation.education_date}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="certificate" class="form-label">Diplôme obtenue</label>
                                                                                <input
                                                                                    type="text"
                                                                                    class="form-control"
                                                                                    id="certificate"
                                                                                    name="certificate"
                                                                                    onChange={event => handleEducationData(index, event)}
                                                                                    value={formation.certificate}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="school" class="form-label">Ecole</label>
                                                                                <input
                                                                                    type="text"
                                                                                    class="form-control"
                                                                                    id="school"
                                                                                    name="school"
                                                                                    onChange={event => handleEducationData(index, event)}
                                                                                    value={formation.school}
                                                                                />
                                                                            </div>
                                                                            <div className="my-4 d-flex justify-content-around align-items-center">
                                                                                <div>
                                                                                    <button
                                                                                        className="btn btn-success fs-5 border px-3"
                                                                                        type="button"
                                                                                        onClick={addEducation}
                                                                                    >
                                                                                        <i className="fa-solid fa-plus"></i> Ajouter une formation
                                                                                    </button>
                                                                                </div>
                                                                                {fillResume.education.length > 1 ?
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-danger fs-5 border px-3"
                                                                                            type="button"
                                                                                            onClick={() => deleteEducation(index)}
                                                                                        >
                                                                                            <i className="fa-solid fa-trash"></i> Supprimer la formation
                                                                                        </button>
                                                                                    </div> : ''
                                                                                }
                                                                            </div>
                                                                        </>                    
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header" id="headingSeven">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExp" aria-expanded="false" aria-controls="collapseExp">
                                                                Expérience
                                                            </button>
                                                        </h2>
                                                        <div id="collapseExp" class="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                            <div class="accordion-body">
                                                                {experience && experience.map((value, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center">
                                                                            <div class="mb-3">
                                                                                <label for="entreprise_update" class="form-label">Entreprise</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="entreprise_update"
                                                                                    name={value.id}
                                                                                    onChange={handleExperienceEntrepriseData}
                                                                                    value={value.entreprise}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="country_update" class="form-label">Pays</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="country_update"
                                                                                    name={value.id}
                                                                                    onChange={handleExperienceCountryData}
                                                                                    value={value.experience_country}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="city_update" class="form-label">Ville</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="city_update"
                                                                                    name={value.id}
                                                                                    onChange={handleExperienceCityData}
                                                                                    value={value.experience_city}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="position_update" class="form-label">Poste</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="position_update"
                                                                                    name={value.id}
                                                                                    onChange={handleExperiencePositionData}
                                                                                    value={value.position}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="begining_date_update" class="form-label">Date de début</label>
                                                                                <input 
                                                                                    type="date" 
                                                                                    class="form-control" 
                                                                                    id="begining_date"
                                                                                    name={value.id}
                                                                                    onChange={handleExperienceDateBeginData}
                                                                                    value={value.date_begin}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="ending_date_update" class="form-label">Date de fin</label>
                                                                                <input 
                                                                                    type="date" 
                                                                                    class="form-control" 
                                                                                    id="ending_date_update"
                                                                                    name={value.id}
                                                                                    onChange={handleExperienceDateEndData}
                                                                                    value={value.date_end}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <textarea
                                                                                    name={value.id}
                                                                                    className="form-control"
                                                                                    placeholder="Veuillez saisir vos tâches"
                                                                                    rows="6"
                                                                                    onChange={(event) => {
                                                                                        if(event.key === 'Enter'){
                                                                                            document.createRange('\n')
                                                                                            event.preventDefault()
                                                                                        }
                                                                                        handleExperienceTasksData(event)}
                                                                                    }
                                                                                    value={value.tasks}
                                                                                >
                                                                                </textarea>
                                                                            </div>
                                                                            <div className="my-4 d-flex justify-content-around align-items-center">
                                                                                {experience.length > 0 ?
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-danger fs-5 border px-2"
                                                                                            type="button"
                                                                                            onClick={() => deleteExperienceUpdated(index, value.id)}
                                                                                        >
                                                                                            <i className="fa-solid fa-trash"></i> Supprimer une expérience
                                                                                        </button>
                                                                                    </div> : ''
                                                                                }
                                                                            </div>
                                                                            <hr/>
                                                                        </div>
                                                                    )
                                                                })}
                                                                {fillResume.experience.map((work, index)=>{
                                                                    return(
                                                                        <div className="row align-items-center">
                                                                            <div class="mb-3">
                                                                                <label for="entreprise" class="form-label">Entreprise</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="entreprise"
                                                                                    name="entreprise"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.entreprise}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="country" class="form-label">Pays</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="country"
                                                                                    name="experience_country"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.experience_country}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="city" class="form-label">Ville</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="city"
                                                                                    name="experience_city"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.experience_city}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="position" class="form-label">Poste</label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    class="form-control" 
                                                                                    id="position"
                                                                                    name="position"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.position}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="begining_date" class="form-label">Date de début</label>
                                                                                <input 
                                                                                    type="date" 
                                                                                    class="form-control" 
                                                                                    id="begining_date"
                                                                                    name="date_begin"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.date_begin || today}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3 col-md-6">
                                                                                <label for="ending date" class="form-label">Date de fin</label>
                                                                                <input 
                                                                                    type="date" 
                                                                                    class="form-control" 
                                                                                    id="ending"
                                                                                    name="date_end"
                                                                                    onChange={event => handleExperienceData(index, event)}
                                                                                    value={work.date_end || today}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <textarea
                                                                                    name="tasks"
                                                                                    className="form-control"
                                                                                    placeholder="Veuillez saisir vos tâches"
                                                                                    rows="6"
                                                                                    onChange={(event) => 
                                                                                        {
                                                                                            if(event.key === 'Enter'){
                                                                                                document.createRange('\n')
                                                                                                event.preventDefault()
                                                                                            }
                                                                                            handleExperienceData(index, event)
                                                                                        }
                                                                                    }
                                                                                    value={work.tasks}
                                                                                >
                                                                                </textarea>
                                                                            </div>
                                                                            <div className="my-4 d-flex justify-content-around align-items-center">
                                                                                <div>
                                                                                    <button
                                                                                        className="btn btn-success fs-5 border px-2"
                                                                                        type="button"
                                                                                        onClick={addExperience}
                                                                                    >
                                                                                        <i className="fa-solid fa-plus"></i> Ajouter une expérience
                                                                                    </button>
                                                                                </div>
                                                                                {fillResume.experience.length > 1 ?
                                                                                    <div>
                                                                                        <button
                                                                                            className="btn btn-danger fs-5 border px-2"
                                                                                            type="button"
                                                                                            onClick={() => deleteExperience(index)}
                                                                                        >
                                                                                            <i className="fa-solid fa-trash"></i> Supprimer une expérience
                                                                                        </button>
                                                                                    </div> : ''
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                                <div class="mb-3">
                                                                    <label for="annee_experience" class="form-label">Années d'expériences</label><input
                                                                        type="number"
                                                                        class="form-control"
                                                                        id="annee_experience"
                                                                        name="years_experience"
                                                                        onChange={handleDataResume}
                                                                        value={(Number(months.size / 12)+ Number(monthsvalue.size / 12)).toFixed(1)}
                                                                        readOnly={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <button type="submit" class="btn btn-primary">Sauvegarder</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-md-6 bg-white border rounded-top mb-4" style={{maxHeight : '1500px'}}>
                                            <div className="row fs-4">
                                                <div className="col-md-12 bg-primary text-white py-2 rounded-top">
                                                    <div className="d-flex align-items-center justify-content-around">
                                                        <div className="d-flex align-items-center break w-100">
                                                            {(image && <img src={URL.createObjectURL(image)} className="profile-img rounded-circle" alt="" />) || image_profil}
                                                            <p className="ms-3">
                                                                {fillResume.fname || candidate.fname} {fillResume.lname || candidate.lname} <br/> 
                                                                <span>{getAge(fillResume.birthday || candidate.birthday)} ans</span>
                                                            </p> 
                                                        </div>
                                                        <div className="break w-75">{fillResume.profil || resume.profil}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 px-4 py-2">
                                                    <div className="fs-5">
                                                        <p>Coordonnées</p>
                                                        <div className="fs-6 d-flex align-items-center">
                                                            <p className="me-1"><i class="fa-solid fa-envelope">:</i></p>
                                                            <p className="break w-100"> {fillResume.email || candidate.email} </p>
                                                        </div>
                                                        <div className="fs-6 d-flex align-items-center">
                                                            <p className="me-1"><i class="fa-solid fa-phone">:</i></p>
                                                            <p className="break w-100"> {fillResume.phone || candidate.phone} </p>
                                                        </div>
                                                        <div className="fs-6 d-flex">
                                                            <p className="me-1"><i className="fa-solid fa-house">:</i></p>
                                                            <p className="break w-100"> {fillResume.candidate_adress || candidate.candidate_adress}</p>
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                        <p>Compétences personelles</p>
                                                        <div className="fs-6">
                                                            {(fillResume.soft.length > 0 || softSkills.length > 0) && 
                                                                <p className="space break">
                                                                    {softSkills.map((value, index)=>{
                                                                        return(
                                                                            <div>
                                                                                {value.softskills && <span className="ms-2">{value.softskills} <br/></span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {fillResume.soft.map((list, index)=>{
                                                                        return(
                                                                            <div>
                                                                                {list.softskills && <span className="ms-2">{list.softskills} <br/></span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                        <p>Compétences techniques</p>
                                                        <div className="fs-6">
                                                        {(fillResume.hard.length > 0 || harskills.length > 0) && 
                                                            <p className="space break">
                                                                {harskills.map((value, key)=>{
                                                                    return(
                                                                        <div>
                                                                            {value.hardskills && <span className="ms-2">{value.hardskills} <br/></span>}
                                                                        </div>
                                                                    )
                                                                })}
                                                                {fillResume.hard.map((list, index)=>{
                                                                    return(
                                                                        <div>
                                                                            {list.hardskills && <span className="ms-2">{list.hardskills} <br/></span>}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </p>
                                                        }
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                        <p>Centres d'intérêts</p>
                                                        <div className="fs-6">
                                                            {(fillResume.hobb.length > 0 || hobbies.length > 0)  && 
                                                                <p className="space break">
                                                                    {hobbies.map((value, key)=>{
                                                                        return(
                                                                            <div>
                                                                                {value.hobbie &&<span className="ms-2"> {value.hobbie} <br/></span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {fillResume.hobb.map((list, index)=>{
                                                                        return(
                                                                            <div>
                                                                                {list.hobbies && <span className="ms-2"> {list.hobbies} <br/></span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 px-4 py-2">
                                                    <div className="fs-5 ">
                                                        <p>Résumé</p>
                                                        <div className="fs-6 break">
                                                            <p className="ms-2"> 
                                                                {fillResume.summuray || resume.summuray}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                        <p>Formations</p>
                                                        <div className="fs-6">
                                                            {(fillResume.education.length > 0 || education.length > 0) && 
                                                                <p className="ms-2 break">
                                                                    {education.map((value, key)=>{
                                                                        return(
                                                                            <div className="mb-3">
                                                                                {value.education_date && <span>Date: {value.education_date && new Date(value.education_date).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.education_date).toLocaleDateString("fr-FR", options).slice(1)}<br /></span>}
                                                                                {value.certificate && <span><strong>Diplome : {value.certificate} </strong><br /></span>}
                                                                                {value.school && <span><strong>Université : {value.school} </strong><br /></span>}
                                                                            </div>
                                                                            )
                                                                        })
                                                                    }
                                                                    {fillResume.education.map((list, index)=>{
                                                                        return(
                                                                            <div className="mb-3">
                                                                                {list.education_date && <span>Date: {list.education_date && new Date(list.education_date).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(list.education_date).toLocaleDateString("fr-FR", options).slice(1)} <br /></span>}
                                                                                {list.certificate && <span><strong>Diplome : {list.certificate} </strong><br /></span>}
                                                                                {list.school && <span><strong>Université : {list.school} </strong><br /></span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </p>
                                                            } 
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                        <p>Expérience</p>
                                                        <div className="fs-6">
                                                            {(fillResume.experience.length > 0 || experience.length > 0 ) && 
                                                                <p className="ms-2"> 
                                                                    {experience.map((value, key)=>{
                                                                        return(
                                                                            <div>
                                                                                {(value.date_begin || value.date_end) && <span>
                                                                                    Date: {
                                                                                        value.date_begin && 
                                                                                        new Date(value.date_begin).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.date_begin).toLocaleDateString("fr-FR", options).slice(1) + 
                                                                                        ' - '  + new Date(value.date_end).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.date_end).toLocaleDateString("fr-FR", options).slice(1)
                                                                                    }   
                                                                                    <br/>
                                                                                </span>}
                                                                                {(value.entreprise || value.experience_country || value.experience_city) && <span>
                                                                                    <strong>
                                                                                        Entreprise: {value.entreprise && value.entreprise + ' | '}
                                                                                        {value.experience_country && value.experience_country + ', '}
                                                                                        {value.experience_city} 
                                                                                    </strong><br />
                                                                                </span>}
                                                                                {value.position && <span>
                                                                                    <strong>Poste: {value.position} </strong> <br/>
                                                                                </span>}
                                                                                {value.tasks && <span>
                                                                                    Tâches:<br/>
                                                                                    <p className="space wrap ms-3">
                                                                                        {value.tasks && 
                                                                                            <span> 
                                                                                                {value.tasks}
                                                                                            </span>
                                                                                        }
                                                                                    </p>
                                                                                </span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {fillResume.experience.map((list, index)=>{
                                                                        return(
                                                                            <div>
                                                                                {(list.date_begin || list.date_end) && <span>
                                                                                    Date: {
                                                                                        list.date_begin && 
                                                                                        new Date(list.date_begin).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(list.date_begin).toLocaleDateString("fr-FR", options).slice(1) + 
                                                                                        ' - '  + new Date(list.date_end).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(list.date_end).toLocaleDateString("fr-FR", options).slice(1)
                                                                                    } 
                                                                                    <br/>
                                                                                </span>}
                                                                                {(list.entreprise || list.experience_country || list.experience_city) && <span>
                                                                                    <strong>
                                                                                        Entreprise: 
                                                                                        {list.entreprise && list.entreprise + ' | '}
                                                                                        {list.experience_country && list.experience_country + ', '}
                                                                                        {list.experience_city} 
                                                                                    </strong><br />
                                                                                </span>}
                                                                                {list.position && <span>
                                                                                    <strong>Poste: {list.position} </strong> <br/>
                                                                                </span>}
                                                                                {list.tasks && <span>
                                                                                    Tâches:<br/>
                                                                                    <p className="space wrap ms-3">
                                                                                        {list.tasks && 
                                                                                            <span> 
                                                                                                {list.tasks}
                                                                                            </span>
                                                                                        }
                                                                                    </p>
                                                                                </span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="fs-5">
                                                    <p>Langues</p>
                                                        <div className="fs-6">
                                                        {(languages.length > 0 || fillResume.lang.length > 0) && 
                                                                <p className="space break">
                                                                    {languages.map((value, key)=>{
                                                                        return(
                                                                            <div>
                                                                                {value.language && <span className="ms-1"> {value.language} : </span>}
                                                                                {value.language &&
                                                                                    <span>
                                                                                        {value.read && <span className="ms-1 small">(
                                                                                            Lu : {(value.read === "Debutant" ? "Débutant" : "") 
                                                                                                        || (value.read === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (value.read === "Avance" ? "Avancé" : "") 
                                                                                                    },
                                                                                        )</span> }
                                                                                        {value.written && <span className="ms-1 small">(
                                                                                            Ecrit : {(value.written === "Debutant" ? "Débutant" : "") 
                                                                                                        || (value.written === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (value.written === "Avance" ? "Avancé" : "") 
                                                                                                    },)</span>}
                                                                                        {value.spoken && <span className="ms-1 small">(
                                                                                            Parlé : {(value.spoken === "Debutant" ? "Débutant" : "") 
                                                                                                        || (value.spoken === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (value.spoken === "Avance" ? "Avancé" : "") 
                                                                                                    })</span>}
                                                                                    </span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {fillResume.lang.map((list, index)=>{
                                                                        return(
                                                                            <div>
                                                                                {list.languages &&<span className="ms-2"> {list.languages} : </span>}
                                                                                {list.languages &&
                                                                                    <span>
                                                                                        {list.read && <span className="ms-1 small">
                                                                                            (Lu : {(list.read === "Debutant" ? "Débutant" : "") 
                                                                                                        || (list.read === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (list.read === "Avance" ? "Avancé" : "") 
                                                                                                    }),
                                                                                        </span> }
                                                                                        {list.written && <span className="ms-1 small">(
                                                                                            Ecrit : {(list.written === "Debutant" ? "Débutant" : "") 
                                                                                                        || (list.written === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (list.written === "Avance" ? "Avancé" : "") 
                                                                                                    }), </span>}
                                                                                        {list.spoken && <span className="ms-1 small">(
                                                                                            Parlé : {(list.spoken === "Debutant" ? "Débutant" : "") 
                                                                                                        || (list.spoken === "Intermediaire" ? "Intermédiaire" : "") 
                                                                                                        || (list.spoken === "Avance" ? "Avancé" : "") 
                                                                                                    }), </span>}
                                                                                    </span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>}
                </> : <Navigate to="/login" />}
        </div>
    )
}