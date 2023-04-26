const { MongoClient } = require("mongodb");
const { dialog } = require('@electron/remote')
const uri =
    "mongodb+srv://admin:admin@nutgod.adcito8.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);


let recipesCollection
let recipes

async function run() {
    try {
        const database = client.db('Dietet_db');
        recipesCollection = database.collection('recipes');

        recipes = await recipesCollection.find({}).toArray()
        //recipes.forEach(recipe => console.log(recipe))
    } finally {
        await client.close();
    }
}

run()
    .then(() => {
        /**
         * Creates the Listener for exiting of the window
         */
        document.getElementById("btnCancel").addEventListener('click', (e) => {
            e.preventDefault()
            let confirmation = confirm("Are you sure to exit?\nYou will lose all changes.");
            if (confirmation) {
                window.location = "main_window.html"
            }
        })

        /**
         * Fills the info got it from the DB
         * @param {*} recipe The chosen recipe
         */
        let fillInfoRecipe = (recipe) => {
            document.getElementById("title").value = recipe.name
            document.getElementById("ingredients").value = recipe.ingredients
            document.getElementById("prepTime").value = recipe.prepTime
            document.getElementById("author").value = recipe.author
            document.getElementById("steps").value = recipe.steps
            switch (recipe.category) {
                case 1:
                    document.getElementById("category").value = "Fit"
                    break;
                case 2:
                    document.getElementById("category").value = "Normal"
                    break;
                case 3:
                    document.getElementById("category").value = "Unhealthy"
                    break;
            }
        }

        let valor = window.location.search
        //creates the instance
        const urlParams = new URLSearchParams(valor);
        //Accesses to the value
        var recipeId = urlParams.get('id');
        console.log(recipeId);

        const recipeSearched = recipes.find(obj => obj._id == recipeId);
        console.log(recipeSearched);

        fillInfoRecipe(recipeSearched)

        document.getElementById("btnSubmit").addEventListener('click', async () => {
            let categoryNumber

            switch (document.getElementById("category").value) {
                case "Fit":
                    categoryNumber = 1
                    break;
                case "Normal":
                    categoryNumber = 2
                    break;
                case "Unhealthy":
                    categoryNumber = 3
                    break;
            }

            //it doesn't update
            await client.connect()
            try {
                await recipesCollection.updateOne(
                    { _id: recipeSearched._id },
                    {
                        $set: {
                            name: document.getElementById("title").value,
                            ingredients: document.getElementById("ingredients").value,
                            prepTime: document.getElementById("prepTime").value,
                            author: document.getElementById("author").value,
                            steps: document.getElementById("steps").value,
                            category: categoryNumber
                        }
                    })
                //text => compass
                console.log("ok");
            } catch (error) {
                console.log(error);
            }

            console.log("[+] Recipe " + document.getElementById("title").value + " has been updated.");
            //fillInfoRecipe(recipeSearched)
            client.close()
        })
    })
    .catch(console.dir)
