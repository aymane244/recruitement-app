import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function RecruiterProfile(){
    const [isLoading, setIsLoading] = useState(true)
    const { tokenRe } = useContext(Auth)
    const [recruiter, setRecruiter] = useState([]);
    const [logo, setLogo] = useState("")
    const [scan, setScan] = useState("")
    const {id} = useParams();
    const navigate = useNavigate();
    let location = useLocation();
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/edit-recruiter/" + id).then((res) => {
            setRecruiter(res.data.recruiter);
            setIsLoading(false)
        });
    }, [id])
    let image;
    if(recruiter.photo === null){
        image = <img src="/images/unkown.jpg" alt="profile" className="profile-img-edit rounded-circle" style={{width : '200px', height : '200px'}}/>
    }else{
        image = <img src={"http://127.0.0.1:8000/storage/"+recruiter.logo} alt="profile" className="border profile-img-edit rounded-circle" style={{width : '200px', height : '200px'}}/>
    }
    function handleRecruiter(event) {
        const { name, value, type, files } = event.target
        setRecruiter(data => ({
          ...data,
          [name]: type === "file" ? files[0] : value,
        }))
    }
    function editRecruiter(event){
        event.preventDefault()
        const data = new FormData();
        data.append("logo", recruiter.image || logo);
        data.append("scan", recruiter.scan || scan);
        data.append("name", recruiter.name);
        data.append("email", recruiter.email);
        data.append("ice", recruiter.ice);
        data.append("registre", recruiter.registre);
        data.append("recruiter_adress", recruiter.recruiter_adress);
        data.append("recruiter_country", recruiter.recruiter_country);
        data.append("recruiter_city", recruiter.recruiter_city);
        axios.post("http://127.0.0.1:8000/api/update-recruiter/" + id, data).then(res => {
            navigate("/recruiter/profil/"+id, { state: res.data.message })
        })
    }
    return(
        <div className="containter my-5">
            {tokenRe ? 
                <>    
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <><h2 className="text-center my-3">Profil</h2><div className="container">
                            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                            <div className="row justify-content-center">
                                <div className="col-md-10 bg-white py-4 shadow rounded border">
                                    <form onSubmit={editRecruiter}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-6">
                                                <div className="row justify-content-center">
                                                    <div className="rounded-circle w-50 py-2 mx-auto text-center col-md-10 mb-3 position-relative">
                                                        {(logo && <img src={URL.createObjectURL(logo)} className="profile-img-edit rounded-circle" alt=""/>) || image}
                                                        <input
                                                            type="file"
                                                            name="logo"
                                                            className="image-input"
                                                            id="inputImage"
                                                            onChange={(event) => event.target.files[0].name.split('.').pop() === ("jpg" || "png" || "jpeg") ? setLogo(event.target.files[0]) : alert("Juste les fichiers de type png, jpg ou jpeg sont acceptés")} />
                                                        <label className="image-label pointer rounded-circle position-absolute" htmlFor="inputImage"><i class="fa-solid fa-pen"></i></label>
                                                    </div>
                                                    <hr className="w-75" />
                                                    <div className="text-center col-md-10 fs-4">
                                                        <a href={"http://127.0.0.1:8000/storage/" + recruiter.scan} download>
                                                            <img src="/images/pdf.png" alt="" />
                                                            <br />
                                                            {(scan && scan.name) ? scan.name : "Fichier scanné"}
                                                        </a>
                                                        <br />
                                                        <input
                                                            type="file"
                                                            name="scan"
                                                            className="file-input"
                                                            id="inputFile"
                                                            onChange={(event) => event.target.files[0].name.split('.').pop() === "pdf" ? setScan(event.target.files[0]) : alert("Juste les fichiers de type pdf sont acceptés")} />
                                                        <label className="file-label pointer" htmlFor="inputFile"><i class="fa-solid fa-upload"></i> Télécharger</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 border-start">
                                                <div className="row justify-content-center">
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="form-control"
                                                            id="floatingName"
                                                            placeholder="Nom de l'entrerprise"
                                                            value={recruiter.name}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingName" className="ps-4">Nom de l'entrerprise</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            id="floatingEmail"
                                                            placeholder="name@example.com"
                                                            value={recruiter.email}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingEmail" className="ps-4">Email de l'entreprise</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="text"
                                                            name="ice"
                                                            className="form-control"
                                                            id="floatingIce"
                                                            placeholder="ICE"
                                                            value={recruiter.ice}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingIce" className="ps-4">N° ICE</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="text"
                                                            name="registre"
                                                            className="form-control"
                                                            id="floatingRegistre"
                                                            placeholder="ICE"
                                                            value={recruiter.registre}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingRegistre" className="ps-4">N° registre de commerce</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-12">
                                                        <input
                                                            type="text"
                                                            name="recruiter_adress"
                                                            className="form-control"
                                                            id="floatingAdress"
                                                            placeholder="Adress"
                                                            value={recruiter.recruiter_adress}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingAdress" className="ps-4">Adresse de l'entrerprise</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="text"
                                                            name="recruiter_country"
                                                            className="form-control"
                                                            id="floatingCountry"
                                                            placeholder="Country"
                                                            value={recruiter.recruiter_country}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingCountry" className="ps-4">Pays</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-6">
                                                        <input
                                                            type="text"
                                                            name="recruiter_city"
                                                            className="form-control"
                                                            id="floatingCity"
                                                            placeholder="City"
                                                            value={recruiter.recruiter_city}
                                                            onChange={handleRecruiter} />
                                                        <label htmlFor="floatingCity" className="ps-4">Ville</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            <button className="btn btn-primary fs-5 px-4">Modifier</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div></>}
                </> :
                <Navigate to="/login"/>
            }
        </div>
    )
}