const inicialState = {     
    recetas:[]
 };

 // EL REDUCER SON LOS ESTADOS QUE VOY A IR TENIENDO
// SWITCH PARECIDO A UN IF
function rootReducer(state = inicialState, action){
    switch(action.type) {
        case "recetas":
            return{
                ...state,
                recetas: action.payload
            }
            default: return {
                state
            }
    }
}
export default rootReducer;