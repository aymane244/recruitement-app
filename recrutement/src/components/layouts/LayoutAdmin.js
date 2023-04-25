import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from "react-bootstrap";
import { useContext } from "react";
import { Auth } from "../context/AuthContext";

export default function LayoutAdmin() {
    const { setAuth, admin, apiAdmin, setLoading, token } = useContext(Auth);
    let navigate = useNavigate();
    setAuth(true);
    async function logoutAdmin(e) {
        e.preventDefault();
        const userLogout = await apiAdmin.post('/api/logout', token)
        localStorage.removeItem('token')
        setAuth(false);
        setLoading(false);
        navigate('/admin', { state: userLogout.data.message })
    }
    return (
        <div>
            <Navbar bg="dark" expand="lg" className="px-4">
                <Navbar.Brand href="/" className="text-white">Recruitement-app</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-white justify-content-center">
                    <Nav.Link href="/admin/entreprises">Entreprises</Nav.Link>
                    <Nav.Link href="/admin/candidates" className="ms-3">Candidats</Nav.Link>
                    <Nav.Link href="/admin/annonces" className="mx-3">Annonces</Nav.Link>
                    <Nav.Link href="/admin/data">Données</Nav.Link>
                </Navbar.Collapse>
                <NavDropdown title={admin.first_name + ' ' + admin.last_name} id="basic-nav-dropdown" className="text-white me-5">
                    <NavDropdown.Item href="/admin/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href={"/admin/profil/"+admin.id}>Editer votre profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3" className="m-0 padding-form">
                        <form onSubmit={logoutAdmin}>
                            <button type="submit" className="bg-transparent border-0">Se déconnecter</button>
                        </form>
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar>
            <Outlet />
        </div>
    )
}