import React, { useContext } from "react";
import { Auth } from "../../context/AuthContext";
import JobSearch from "../jobs/JobSearch";

export default function Hero() {
    const {tokenRe} = useContext(Auth) 
    return (
        <div>
            <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner position-relative w-100 h-100">
                    <div className="carousel-item active">
                        <div className="bg-dark w-100 h-100 position-absolute top-0 start-0 opacity-50"></div>
                        <img src="images/image-1.jpg" className="d-block w-100 img-height" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <div className="bg-dark w-100 h-100 position-absolute top-0 start-0 opacity-50"></div>
                        <img src="images/image-2.jpg" className="d-block w-100 img-height" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <div className="bg-dark w-100 h-100 position-absolute top-0 start-0 opacity-50"></div>
                        <img src="images/image-3.jpg" className="d-block w-100 img-height" alt="..." />
                    </div>
                    <div className="carousel-caption d-none d-md-block position-absolute top-50">
                        <h1>Changez votre monde</h1>
                        <p className="fs-3">Lancez votre carrière avec nous</p>
                        <hr className="hr-style" />
                        <div className="pt-4">
                            {tokenRe ? '' : <JobSearch />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}