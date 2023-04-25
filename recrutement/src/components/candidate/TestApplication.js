import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import TestStart from "./TestStart";
import TestMain from "./TestMain";
import { Auth } from "../context/AuthContext";

export default function TestApplication(){
    const {tokenCa} = useContext(Auth)
    const { id } = useParams();
    const [test, setTest] = useState([]);
    const [name, setName] = useState([]);
    const [count, setCount] = useState(0);
    const [testState, setTestState] = useState(true);
    const [runTimer, setRunTimer] = useState(false);
    console.log(test)
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/get-test-application/" + id).then((response) => {
            setTest(response.data.questions);
            setName(response.data.quiz_name);
            setCount(response.data.count);
        });
    }, [id])
    function changeState() {
        setTestState(prevState => !prevState)
        setRunTimer((t) => !t);
    }
    return(
        <div className="container my-5">
            {tokenCa ?
                <>
                    <h1 className="text-center">{name.titre}</h1>
                    {testState ?    
                        <TestStart
                            change={changeState}
                            quize_id = {name}
                        /> :
                        <TestMain
                            test={test}
                            setTest={setTest}
                            runTimer={runTimer}
                            setRunTimer={setRunTimer}
                            quize_id = {name}
                            count = {count}
                        />
                    }
                </>
            : <Navigate to="/login" /> }
        </div>
    )
}