import React from "react";
import { Link } from "react-router-dom";

export default function AccessWitoutLogin(){
    return(
        <div>
            <Link to='/admin'>Please login first</Link>
        </div>
    )
}