import { Outlet } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useContext } from "react";
import { Auth } from "../context/AuthContext";
import LayoutRecruiter from "./LayoutRecruiter";
import LayoutAdmin from "./LayoutAdmin";
import LayoutCandidate from "./LayoutCandidate";

export default function Layout() {
  const { tokenRe, tokenCa, token, setLoading } = useContext(Auth);
  setLoading(false)
  return (
    <div>
      {tokenRe ? <LayoutRecruiter /> : token ? <LayoutAdmin /> : tokenCa ? <LayoutCandidate /> :
        <>
          <Navbar bg="dark" expand="lg" className="px-4">
            <Navbar.Brand href="/" className="text-white">Recruitement-app</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="text-white justify-content-end">
              <Nav.Link href="/login" className="text-white">Se connecter</Nav.Link>
            </Navbar.Collapse>
          </Navbar>
          <Outlet />
        </>
      }
    </div>
  )
};