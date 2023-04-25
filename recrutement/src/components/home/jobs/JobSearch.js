import React, { useContext} from "react";
import { Search } from "../../../App";

export default function JobSearch(){
    const {setSearchJob, searchJob, jobs, setSearchCity, searchCity, cities} = useContext(Search)
    return(
        <div>
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex align-items-center">
                        <i class="fa-sharp fa-solid fa-location-dot text-dark fs-5 position-absolute ms-2"></i>
                        <input 
                            className="form-control ps-5" 
                            list="datalistOptions" 
                            name="city"
                            id="exampleDataList" 
                            placeholder="Villes" 
                            onChange={(e)=> setSearchCity(e.target.value)}
                            value={searchCity}
                        />
                    </div>
                    <datalist id="datalistOptions">
                        {cities && cities.map((list, index)=>{
                            return(
                                <>
                                    <option value={list.annonce_city} />
                                </>
                            )
                        })}
                    </datalist>
                </div>
                <div className="col-md-6">
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-magnifying-glass text-dark position-absolute ms-2 fs-5"></i>
                        <input 
                            className="form-control ps-5"
                            name="announce"
                            list="datalistJobs" 
                            id="DataJobs" 
                            placeholder="Profession" 
                            onChange={(e)=> setSearchJob(e.target.value)}
                            value={searchJob}
                        />
                    </div>
                    <datalist id="datalistJobs">
                        {jobs && jobs.map((list, index)=>{
                            return(
                                <>
                                    <option value={list.job_position} />
                                </>
                            )
                        })}
                    </datalist>
                </div>
            </div>
        </div>
    )
}