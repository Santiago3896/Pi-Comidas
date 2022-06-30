const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require ("axios");
const { Recipe, Diet } = require ("../db.js");
const recipe = require('../models/recipe.js');

const { API_KEY } = process.env;

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// 1° Paso: ME TRAIGO LA INFO DE LA API
// const getApiInfo = async() => {
// let apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`)
// let apiTotall = []
// if(apiUrl && apiUrl.results){
//     apiTotall = apiUrl.results
// }

// apiTotall = await apiTotall.map(el => {
//     return {
//         id: el.id,
//         name: el.title,
//         diet: el.diets,
//     }
// })
// return apiTotall;
// };

const getAllRecipesAPI = async () => {
    try {
        let recipes = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);

        recipes = recipes.data.results.map(res => (
            {
                id: `${res.id}-API`,
                name: res.title,
                // Diet: res.diets,

            }
        ));

        return recipes;
    } catch (error) {
        console.log(error)
    }
}
// 2° Paso: ME TRAIGO LA INFO DE LA DB
const getDbInfo = async()=>{
    return await Recipe.findAll({
        includes:{
            model:Diet,
            attributes: ["name"],
            through:{
                attributes:[],
            }
        }
    })
}

// 3° Paso: CONCATENO LA INFO DE LA API CON LA DE DB
const getAllRecipes = async()=>{
    const apiInfo = await getAllRecipesAPI();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
}


router.get("/Recipes", async (req,res)=>{
    const name = req.query.name
    let recipeTotal = await getAllRecipes ();
    if (name){
        let recipeName = await recipeTotal.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))
        recipeName.length ?
        res.status(200).send(recipeName) :
        res.status(404).send("No esta la receta, sory");
        // TRAEME TAL RECETA POR QUERY, SI NO LA ENCONTRAS RESPONDEME CON EL 404...
    }else{
        res.status(201).send(recipeTotal)
    } // SI NO PEDIMOS NADA POR QUERY, TRAEME TODAS LAS RECETAS
})

router.get("/Diets", async(req,res)=>{
    const dietasApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
    const dietas = dietasApi.data.results.map(el=> el.diets)
    var santiago = []
    const dietasEach = dietas.map(el=> {
        for (let i=0; i<el.length; i++){
            if (!santiago.includes(el[i])){
                    santiago.push(el[i])
                }}return santiago})
                
         santiago.forEach(el=> {
        Diet.findOrCreate({
            where: { name: el }
        })
    })

   dietasEach[1].forEach(el=> {
        if(el){
    Diet.findOrCreate({
        where: { name: el }
    })}
})
    const allDietas= await Diet.findAll();
    res.send(allDietas);
})
// CREAR UNA RECETA NUEVA EN LA BASE DE DATOS
router.post(`/Recipes`, async (req,res)=> {
    let{                              // LE PASO LOS DATOS QUE QUIERO MANDAR POR BODY
        name,
        createdInDb,
        diet
    } = req.body
    let recipesCreated = await Recipe.create ({
        name,                          // CREO LO QUE QUIERO PONER EN DB
        createdInDb
    })
    let dietDb= await Diet.findAll({
        where: { name: diet }         // BUSCO EN TODAS LAS DIETAS 
    })
    recipesCreated.addDiet(dietDb)   // AGREGO LA RECETA A MI BASE DE DIETAS
    res.send("Receta")
})
// BUSCO UNA RECETA POR EL ID QUE LE PASO POR PARAMS
router.get("/recipes/:id", async (req,res) => {
    const {id} = req.params
    const recipesTotal= await getAllRecipes()
    if(id){
        let recipesId = await recipesTotal.filter(el => el.id == id)
        recipesId.length ?
        res.status(200).json(recipesId) :
        res.status(404).send("No encontre esa receta")
    }
})
// CAMBIAR LA API_KEY SINO NO PUEDO SEGUIR USANDOLO
module.exports = router;
