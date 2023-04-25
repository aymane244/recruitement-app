import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CandidateCV({id}) {
    const [candidate, setCandidate] = useState([]);
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [hardSkills, setHardSkills] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [resume, setResume] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    let options = { year: 'numeric', month: 'long'};
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/api/get-CV/"+id).then(response => {
            setCandidate(response.data.candidates)
            setEducation(response.data.educations)
            setExperience(response.data.experiences)
            setHardSkills(response.data.hard_skills)
            setHobbies(response.data.hobbies)
            setLanguages(response.data.languages)
            setResume(response.data.resumes)
            setSoftSkills(response.data.soft_skills)
        })
    }, [])
    let image_profil
    if(candidate.photo === null){
        image_profil = <img src="/images/unkown.jpg" alt="profile" className="profile-img rounded-circle"/>
    }else{
        image_profil = <img src={"http://127.0.0.1:8000/storage/"+candidate.photo} alt="profile" className="profile-img rounded-circle"/>
    }
    return (
        <div className="col-md-12 bg-white rounded-top mb-4" style={{ maxHeight: '1500px' }}>
            <div className="row fs-4">
                <div className="col-md-12 bg-primary text-white py-2 rounded-top">
                    <div className="d-flex align-items-center justify-content-around">
                        <div className="d-flex align-items-center break w-100">
                            {image_profil}
                            <p className="ms-3">
                                {candidate.fname} {candidate.lname} <br />
                            </p>
                        </div>
                        <div className="break w-75">{resume.profil === null ? '' : resume.profil}</div>
                    </div>
                </div>
                <div className="col-md-4 px-4 py-2 border-end">
                    <div className="fs-5">
                        <p>Coordonnées</p>
                        <div className="fs-6 d-flex align-items-center">
                            <p className="me-1"><i class="fa-solid fa-envelope">:</i></p>
                            <p className="break w-100"> {candidate.email} </p>
                        </div>
                        <div className="fs-6 d-flex align-items-center">
                            <p className="me-1"><i class="fa-solid fa-phone">:</i></p>
                            <p className="break w-100"> {candidate.phone} </p>
                        </div>
                        <div className="fs-6 d-flex">
                            <p className="me-1"><i className="fa-solid fa-house">:</i></p>
                            <p className="break w-100"> {candidate.candidate_adress}</p>
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Compétences personelles</p>
                        <div className="fs-6">
                            {softSkills.length > 0 ?
                                <p className="space break">
                                    {softSkills.map((value, index) => {
                                        return (
                                            <div>
                                                {value.softskills && <span className="ms-2">{value.softskills} <br /></span>}
                                            </div>
                                        )
                                    })}
                                </p>
                            : ''}
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Compétences techniques</p>
                        <div className="fs-6">
                            {hardSkills.length > 0 ?
                                <p className="space break">
                                    {hardSkills.map((value, key) => {
                                        return (
                                            <div>
                                                {value.hardskills && <span className="ms-2">{value.hardskills} <br /></span>}
                                            </div>
                                        )
                                    })}
                                </p>
                            : ''}
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Centres d'intérêts</p>
                        <div className="fs-6">
                            {hobbies.length > 0 ?
                                <p className="space break">
                                    {hobbies.map((value, key) => {
                                        return (
                                            <div>
                                                {value.hobbie && <span className="ms-2"> {value.hobbie} <br /></span>}
                                            </div>
                                        )
                                    })}
                                </p>
                            : ''}
                        </div>
                    </div>
                </div>
                <div className="col-md-8 px-4 py-2">
                    <div className="fs-5 ">
                        <p>Résumé</p>
                        <div className="fs-6 break">
                            <p className="ms-2">
                                {resume.summuray === null ? '' : resume.summuray}
                            </p>
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Formations</p>
                        <div className="fs-6">
                            {education.length > 0 ?
                                <p className="ms-2 break">
                                    {education.map((value, key) => {
                                        return (
                                            <div className="mb-3">
                                                {value.education_date && <span>Date: {value.education_date && new Date(value.education_date).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.education_date).toLocaleDateString("fr-FR", options).slice(1)}<br /></span>}
                                                {value.certificate && <span><strong>Diplome : {value.certificate} </strong><br /></span>}
                                                {value.school && <span><strong>Université : {value.school} </strong><br /></span>}
                                            </div>
                                        )
                                    })
                                    }
                                </p>
                            : ''}
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Expérience</p>
                        <div className="fs-6">
                            {experience.length > 0 ?
                                <p className="ms-2">
                                    {experience.map((value, key) => {
                                        return (
                                            <div>
                                                {(value.date_begin || value.date_end) && <span>
                                                    Date: {
                                                        value.date_begin &&
                                                        new Date(value.date_begin).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.date_begin).toLocaleDateString("fr-FR", options).slice(1) +
                                                        ' - ' + new Date(value.date_end).toLocaleDateString("fr-FR", options).charAt(0).toUpperCase() + new Date(value.date_end).toLocaleDateString("fr-FR", options).slice(1)
                                                    }
                                                    <br />
                                                </span>}
                                                {(value.entreprise || value.experience_country || value.experience_city) && <span>
                                                    <strong>
                                                        Entreprise: {value.entreprise && value.entreprise + ' | '}
                                                        {value.experience_country && value.experience_country + ', '}
                                                        {value.experience_city}
                                                    </strong><br />
                                                </span>}
                                                {value.position && <span>
                                                    <strong>Poste: {value.position} </strong> <br />
                                                </span>}
                                                {value.tasks && <span>
                                                    Tâches:<br />
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
                                </p>
                            : ''}
                        </div>
                    </div>
                    <div className="fs-5">
                        <p>Langues</p>
                        <div className="fs-6">
                            {languages.length > 0 ?
                                <p className="space break">
                                    {languages.map((value, key) => {
                                        return (
                                            <div>
                                                {value.language && <span className="ms-1"> {value.language} : </span>}
                                                {value.language &&
                                                    <span>
                                                        {value.read && <span className="ms-1 small">(
                                                            Lu : {(value.read === "Debutant" ? "Débutant" : "")
                                                                || (value.read === "Intermediaire" ? "Intermédiaire" : "")
                                                                || (value.read === "Avance" ? "Avancé" : "")
                                                            },
                                                            )</span>}
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
                                </p>
                             : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}