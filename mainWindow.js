const { MongoClient } = require("mongodb");
const { dialog } = require('@electron/remote')
const uri =
    "mongodb+srv://admin:admin@nutgod.adcito8.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);


let recipes

async function run() {
    try {
        const database = client.db('Dietet_db');
        const usersCollection = database.collection('recipes');

        recipes = await usersCollection.find({}).toArray()
        recipes.forEach(recipe => console.log(recipe))
    } finally {
        await client.close();
    }
}

run()
    .then(() => {
        let galleryRecipes = ""

        let showRecipes = () => {
            recipes.forEach((element, index) => {
                galleryRecipes += `
                <div class="col-lg-2 col-md-4 col-6 w-auto" id="recipe${index}">
                    <figure class="figure rounded-2 shadow-lg">
                            <img alt="image${index}" class="img-fluid img-thumbnail figure-img shadow m-2" src="img/DefaultRecipePicture.png" style="width: 300px; height: 300px; object-fit: fill">
                            <br/>
                            <b>${element.name}</b>
                            <p>${element.ingredients}</p>
                    </figure>
                </div>`
            })
            document.getElementById("gallery").innerHTML = galleryRecipes
        }
        showRecipes()
    })
    .catch(console.dir)