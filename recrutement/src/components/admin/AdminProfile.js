import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../context/AuthContext";

export default function AdminProfile(){
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useContext(Auth)
    const [admin, setAdmin] = useState([]);
    const [image, setImage] = useState("")
    const {id} = useParams();
    const navigate = useNavigate();
    let location = useLocation();
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/edit-admin/" + id).then((res) => {
            setAdmin(res.data.admin);
            setIsLoading(false)
        });
    }, [id])
    let image_admin;
    if(admin.image === null){
        image_admin = <img src="/images/unkown.jpg" alt="profile" className="profile-img-edit rounded-circle"/>
    }else{
        image_admin = <img src={"http://127.0.0.1:8000/storage/"+admin.image} alt="profile" className="border profile-img-edit rounded-circle"/>
    }
    function handleAdmin(event) {
        const { name, value, type, files } = event.target
        setAdmin(data => ({
          ...data,
          [name]: type === "file" ? files[0] : value,
        }))
    }
    function editAdmin(event){
        event.preventDefault()
        const data = new FormData();
        data.append("first_name", admin.first_name);
        data.append("last_name", admin.last_name);
        data.append("image", admin.image || image);
        data.append("email", admin.email);
        axios.post("http://127.0.0.1:8000/api/update-admin/" + id, data).then(res => {
            navigate("/admin/profil/"+id, { state: res.data.message })
        })
    }
    return(
        <div className="containter mt-5">
            {token ? 
                <>    
                    {isLoading === true ? <div className='text-center margin-img'><img src='/images/loading-gif.gif' alt='loading'/></div> :
                    <><h2 className="text-center my-3">Profil</h2><div className="container">
                            {location.state && <div className="alert alert-success mt-3 w-50 mx-auto text-center" role="alert">{location.state}</div>}
                            <div className="row justify-content-center">
                                <div className="col-md-10 bg-white py-4 shadow rounded border">
                                    <form onSubmit={editAdmin}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-6">
                                                <div className="row justify-content-center">
                                                    <div className="rounded-circle w-50 py-2 mx-auto text-center col-md-10 mb-3 position-relative">
                                                        {(image && <img src={URL.createObjectURL(image)} className="profile-img-edit rounded-circle" alt="" />) || image_admin}
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            className="image-input"
                                                            id="inputImage"
                                                            onChange={(event) => event.target.files[0].name.split('.').pop() === ("jpg" || "png" || "jpeg") ? setImage(event.target.files[0]) : alert("Juste les fichiers de type png, jpg ou jpeg sont acceptés")} />
                                                        <label className="image-label pointer rounded-circle position-absolute" htmlFor="inputImage"><i class="fa-solid fa-pen"></i></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 border-start">
                                                <div className="row justify-content-center">
                                                    <div className="form-floating mb-3 col-md-12">
                                                        <input
                                                            type="text"
                                                            name="first_name"
                                                            className="form-control"
                                                            id="floatingName"
                                                            placeholder="Nom de l'entrerprise"
                                                            value={admin.first_name}
                                                            onChange={handleAdmin} />
                                                        <label htmlFor="floatingName" className="ps-4">Prénom</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-12">
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            className="form-control"
                                                            id="floatingIce"
                                                            placeholder="last_name"
                                                            value={admin.last_name}
                                                            onChange={handleAdmin} />
                                                        <label htmlFor="floatingIce" className="ps-4">Nom</label>
                                                    </div>
                                                    <div className="form-floating mb-3 col-md-12">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            id="floatingEmail"
                                                            placeholder="name@example.com"
                                                            value={admin.email}
                                                            onChange={handleAdmin} 
                                                        />
                                                        <label htmlFor="floatingEmail" className="ps-4">Email</label>
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