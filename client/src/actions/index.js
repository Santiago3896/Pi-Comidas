import axios from "axios";


//DISPATCH, EXPORTA SOLO LAS ACCIONES AL REDUCER SIN TENER QUE IMPORTARLAS
export function getRecipes (){
    return async function(dispatch){
        var json = await axios.get("http://localhost:3001/Recipes");
     return dispatch({
        type: "recetas",
        payload: json.data
    })
}
}