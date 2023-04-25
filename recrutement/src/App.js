import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import RegisterRecuirter from './components/recruiter/RegisterRecuirter';
import RegisterCandidate from './components/candidate/RegisterCandidate';
import LoginAdmin from './components/admin/LoginAdmin';
import RegisterAdmin from './components/admin/RegisterAdmin';
import Dashboard from './components/admin/Dashboard';
import Jobs from './components/home/jobs/Jobs';
import JobDescription from './components/home/jobs/JobDescription';
import JobApply from './components/home/jobs/JobApply';
import AccessWitoutLogin from './components/errors/AccessWitoutLogin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardRecruite from './components/recruiter/DashboardRecruite';
import DashboardCandiate from './components/candidate/DasboardCandidate';
import Home from './components/home/Home';
import AddAnnounce from './components/recruiter/AddAnnounce';
import Layout from './components/layouts/Layout';
import ShowAnnonce from './components/recruiter/ShowAnnonce';
import AddTest from './components/recruiter/AddTest';
import ShowTest from './components/recruiter/ShowTest';
import EspaceCV from './components/candidate/EspaceCV';
import CandidatesList from './components/recruiter/CandidatesList';
import MyTest from './components/candidate/MyTest';
import TestApplication from './components/candidate/TestApplication';
import MyOffers from './components/candidate/MyOffers';
import OffresSaved from './components/candidate/OffresSaved';
import CandidateAnswers from './components/recruiter/CandiadteAnswers';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import CoverLetter from './components/candidate/CoverLetter';
import SuccessefullCandidate from './components/recruiter/SuccessfullCandidate';
import RecommandedCandidates from './components/recruiter/RecommandedCandidates';
import ListEntreprises from './components/admin/ListEntreprises';
import ListCandidates from './components/admin/ListCandidates';
import ListOffers from './components/admin/ListOffers';
import Metadata from './components/admin/metadata/Metadata';
import { Auth } from './components/context/AuthContext';
import RecruiterProfile from './components/recruiter/RecruiterProfil';
import EditAnnonce from './components/recruiter/EditAnnonce';
import EditTest from './components/recruiter/EditTest';
import CandidateCV from './components/recruiter/CandidateCV';
import AdminProfile from './components/admin/AdminProfile';

export const Search = createContext();
function App() {
  const [jobs, setJobs] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchJob, setSearchJob] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const { loading } = useContext(Auth)
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/jobs").then((response) => {
      setJobs(response.data.annonces);
      setCities(response.data.cities);
    });
  }, [])
  return (
    <div>
      {<BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout /> }>
            <Route 
              index 
              element={
                <Search.Provider value={{ jobs, setJobs, cities, setCities, searchJob, setSearchJob, searchCity, setSearchCity }}>
                  <Home />
                </Search.Provider>
              }>
            </Route>
            <Route 
              path="jobs" 
              element={
                <Search.Provider value={{ jobs, setJobs, cities, setCities, searchJob, setSearchJob, searchCity, setSearchCity }}>
                  <Jobs />
                </Search.Provider>
              }>  
            </Route>
            <Route path="jobs/job-description/:id" element={<JobDescription />}></Route>
            <Route path="jobs/job-description/:id/job-apply" element={<JobApply />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="recruiter/register" element={<RegisterRecuirter />}></Route>
            <Route path="recruiter/dashboard" element={<DashboardRecruite />}></Route>
            <Route path="recruiter/add-test" element={<AddTest />}></Route>
            <Route path="recruiter/tests" element={<ShowTest />}></Route>
            <Route path="recruiter/add-job-offer" element={<AddAnnounce />}>  </Route>
            <Route path="recruiter/annonces" element={<ShowAnnonce />}>  </Route>
            <Route path="recruiter/candidates" element={<SuccessefullCandidate />}>  </Route>
            <Route path="recruiter/recommended" element={<RecommandedCandidates />}>  </Route>
            <Route path="recruiter/candidateCV" element={<CandidateCV />}>  </Route>
            <Route path="recruiter/test-results/:id" element={<CandidateAnswers />}>  </Route>
            <Route path="recruiter/edit_annonce/:id" element={<EditAnnonce />}>  </Route>
            <Route path="recruiter/edit-test/:id" element={<EditTest />}>  </Route>
            <Route path="recruiter/profil/:id" element={<RecruiterProfile />}>  </Route>
            <Route path="recruiter/candidats-annonces/:id" element={<CandidatesList />}>  </Route>
            <Route path="candidate/register" element={<RegisterCandidate />}></Route>
            <Route path="candidate/dashboard" element={<DashboardCandiate />}></Route>
            <Route path="candidate/CV" element={<EspaceCV />}></Route>
            <Route path="candidate/tests" element={<MyTest />}></Route>
            <Route path="candidate/offres" element={<MyOffers />}></Route>
            <Route path="candidate/cover-letter" element={<CoverLetter />}></Route>
            <Route path="candidate/offres-sauvgardes" element={<OffresSaved />}></Route>
            <Route path="candidate/test/:id" element={<TestApplication />}></Route>
            <Route path="admin/" element={<LoginAdmin />}></Route>
            <Route path="admin/register" element={<RegisterAdmin />}></Route>
            <Route path="admin/dashboard" element={<Dashboard />}></Route>
            <Route path="admin/entreprises" element={<ListEntreprises />}></Route>
            <Route path="admin/candidates" element={<ListCandidates />}></Route>
            <Route path="admin/annonces" element={<ListOffers />}></Route>
            <Route path="admin/data" element={<Metadata />}></Route>
            <Route path="admin/errors" element={<AccessWitoutLogin />}></Route>
            <Route path="admin/profil/:id" element={<AdminProfile />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>}
    </div>
  );
}

export default App;
