import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import App from '../../App';

export const Auth = createContext();
export default function AuthContext(){
    const [recruiter, setRecruiter] = useState([])
    const [candidate, setCandidate] = useState([])
    const [admin, setAdmin] = useState([])
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const tokenRe = localStorage.getItem('tokenRe');
    const tokenCa = localStorage.getItem('tokenCa');
    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: {
            'X-Requested-with': 'XMLHttpRequest', Authorization: `Bearer ${tokenRe}`
        },
        withCredentials: true
    })
    const apiCandidate = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: {
            'X-Requested-with': 'XMLHttpRequest', Authorization: `Bearer ${tokenCa}`
        },
        withCredentials: true
    })
    const apiAdmin = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: {
            'X-Requested-with': 'XMLHttpRequest', Authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    useEffect(() => {
        async function getRecruiter() {
            const recruits = await api.get('/api/loggedRecruiter');
            setRecruiter(recruits.data.recruite)
            setLoading(false);
        }
        getRecruiter()
    }, [auth])
    useEffect(() => {
        async function getCandidate() {
            const candidates = await apiCandidate.get('/api/loggedCandidate');
            setCandidate(candidates.data.candidate)
            setLoading(false);
        }
        getCandidate()
    }, [auth])
    useEffect(() => {
        async function getAdmin() {
            const admins = await apiAdmin.get('/api/logged');
            setAdmin(admins.data.admin)
            setLoading(false);
        }
        getAdmin()
    }, [auth])

    return (
        <Auth.Provider value={{ auth, setAuth, recruiter, api, tokenRe, candidate, tokenCa, apiCandidate, loading, setLoading, admin, apiAdmin, token }}>
            <App/>
        </Auth.Provider>
    )
}