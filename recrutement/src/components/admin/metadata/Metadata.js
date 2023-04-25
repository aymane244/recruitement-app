import React, { useState } from "react";
import AddHardSkills from "./add/AddHardSkills";
import AddLanguages from "./add/AddLanguages";
import AddSoftSkills from "./add/AddSoftSkills";

export default function Metadata() {
    const [state, setState] = useState('lang')
    function changeState(event) {
        setState(event.target.id)
    }
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-around">
                <button className="btn btn-primary fs-5" id="lang" onClick={changeState}>Langues</button>
                <button className="btn btn-primary fs-5" id="hard" onClick={changeState}>Compétences techniques</button>
                <button className="btn btn-primary fs-5" id="soft" onClick={changeState}>Compétences personnelles</button>
            </div>
            {state === 'lang' && <AddLanguages />}
            {state === 'hard' && <AddHardSkills />}
            {state === 'soft' && <AddSoftSkills />}
        </div>
    )
}