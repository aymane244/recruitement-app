import { Outlet, useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from "react-bootstrap";
import { useContext } from "react";
import { Auth } from "../context/AuthContext";

export default function LayoutCandidate() {
    const { setAuth, candidate, tokenCa, apiCandidate, setLoading } = useContext(Auth);
    setAuth(true);
    let navigate = useNavigate();
    async function logoutCandidate(e) {
        e.preventDefault();
        const candidateLogout = await apiCandidate.post('/api/logoutCandidate', tokenCa)
        localStorage.removeItem('tokenCa')
        setAuth(false);
        setLoading(false);
        navigate('/login', { state: candidateLogout.data.message })
    }
    return (
        <div>
            <Navbar bg="dark" expand="lg" className="px-4">
                <Navbar.Brand href="/" className="text-white">Recruitement-app</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="text-white justify-content-center">
                    <Nav.Link href="/candidate/CV" className="ms-3">Espace CV</Nav.Link>
                    <Nav.Link href="/candidate/cover-letter" className="ms-3">Lettre de motivation</Nav.Link>
                    <Nav.Link href="/candidate/offres" className="ms-3">Mes Candidatures</Nav.Link>
                    <Nav.Link href="/candidate/offres-sauvgardes" className="ms-3">Offres sauvgardés</Nav.Link>
                    <Nav.Link href="/candidate/tests" className="ms-3">Mes tests</Nav.Link>
                </Navbar.Collapse>
                <NavDropdown title={candidate.fname + ' ' + candidate.lname} id="basic-nav-dropdown" className="text-white margin-navbar">
                    <NavDropdown.Item href="/candidate/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3" className="m-0 padding-form">
                        <form onSubmit={logoutCandidate}>
                            <button type="submit" className="bg-transparent border-0">Se déconnecter</button>
                        </form>
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar>
            <Outlet />
        </div>
    )
}