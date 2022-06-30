import React from "react"
import {Link} from "react-router-dom"

export default function LandingPage (){
    return(     
    <div>
    <h1>Bienvenido a la pagina de comida</h1>
    <Link to={"/home"}>
    <button> Ingresar a Home </button>
    </Link>
    </div>
    )
}
