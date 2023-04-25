import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TestStart(props) {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    let p;
    if(window.performance.getEntriesByType("navigation")) {
        p = window.performance.getEntriesByType("navigation")[0].type;
        if(p ==='reload'){
            navigate('/login');
        }
    }
    useEffect(() => {
        const handleVisibilityChange = () => {
          setIsVisible(!document.hidden);
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, []);
      if(isVisible === false){
        navigate('/login');
      }
    return(
        <div className="container">
            <div className="border shadow mt-4 w-75 mx-auto bg-white">
                <p className="fs-5 px-5 py-3 text-center">{props.quize_id.description}</p>
                <div className="text-center mb-4">
                    <button className="btn btn-primary" onClick={props.change}>Commencer</button>
                </div>
            </div>
        </div>
    )
}