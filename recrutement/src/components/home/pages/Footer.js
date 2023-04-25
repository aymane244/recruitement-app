import React from "react";

export default function Footer() {
    return (
        <div className="bg-dark text-white">
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="d-flex">
                            <img src="/images/image-1.jpg" alt="" className="me-3 logo-job" />
                            <p>This app is considered as recruitement app for all the parties intrested</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="me-3">
                                <div>About Us</div>
                                <div>Contact Us</div>
                                <div>Privacy Policy</div>
                            </div>
                            <div>
                                <div>Browse Jobs</div>
                                <div>Browse Companies</div>
                                <div>Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}