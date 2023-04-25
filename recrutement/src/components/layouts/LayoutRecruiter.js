import React, { useContext } from "react";
import { Auth } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from "react-bootstrap";

export default function LayoutRecruiter(){
    const { setAuth, recruiter, api, setLoading, tokenRe } = useContext(Auth);
    let navigate = useNavigate();
    setAuth(true)
    async function logoutRecruiter(e){
        e.preventDefault();
        const recruiterLogout = await api.post('/api/logoutRecruiter', tokenRe)
        localStorage.removeItem('tokenRe')
        setAuth(false);
        setLoading(false);
        navigate('/login', { state: recruiterLogout.data.message })
    }
    return(
        <div>
            <Navbar bg="dark" expand="lg" className="px-4">
                <Navbar.Brand href="/" className="text-white">Recruitement-app</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-white justify-content-center">
                    <Nav.Link href="/recruiter/annonces">Vos annonces</Nav.Link>
                    <Nav.Link href="/recruiter/tests" className="ms-3">Vos tests</Nav.Link>
                    <Nav.Link href="/recruiter/candidates" className="mx-3">Candidats réussies</Nav.Link>
                    <Nav.Link href="/recruiter/recommended">Candidats recommandés</Nav.Link>
                </Navbar.Collapse>
                <NavDropdown title={recruiter.name} id="basic-nav-dropdown" className="text-white me-5">
                    <NavDropdown.Item href="/recruiter/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href={"/recruiter/profil/"+recruiter.id} target="_blank">Editer votre profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3" className="m-0 padding-form">
                        <form onSubmit={logoutRecruiter}>
                            <button type="submit" className="bg-transparent border-0">Se déconnecter</button>
                        </form>
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar>
            <Outlet />
        </div>
    )
}