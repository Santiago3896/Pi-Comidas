import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { getRecipes } from "../actions";
import {Link} from "react-router-dom"
import Card from "./card";


export default function Home (){
    const dispatch = useDispatch();
    const allRecipes = useSelector((state => state.recetas))



    useEffect ( ()=> {
        dispatch(getRecipes());
    },[dispatch])
    
    function handleClick (e){
    e.preventDefault();
    dispatch(getRecipes());
        }


    return(
        <div>
            <button onClick={e=> {handleClick(e)}}> 
            Volver a cargar las recetas
            </button>
             {
                allRecipes && allRecipes.map(e =>{
                        return (
                    <Card 
                    nombre={e.name} 
                    />
                )})
            }
        </div>
    )
}