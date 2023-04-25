import React, { useState } from "react";
import LoginCandidate from "./candidate/LoginCandidate";
import Footer from "./home/pages/Footer";
import LoginRecruiter from "./recruiter/LoginRecruiter";

export default function Login() {
    const [profile, setProfile] = useState(true);
    function handleProfile() {
        setProfile(prevProfile => !prevProfile)
    }
    return (
        <div>
            <div className="div-position">
                <img src="/images/studen.webp" className="w-100 img-height" alt="" />
                <div className="bg-opacity"></div>
                <div className="div-pos mt-5">
                    <div className="login w-75 mx-auto text-white">
                        <h1 className="text-center pt-4">Login page</h1>
                        <div className="d-flex justify-content-around mt-4">
                            <h3 className="pointer" onClick={handleProfile}>Vous êtes {profile ? "Recruteur" : "Candidat"} Clickez ici</h3>
                        </div>
                        {profile ? <LoginCandidate /> : <LoginRecruiter />}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}