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
        recipes.forEach(recipe => console.log(recipe))
    } finally {
        await client.close();
    }
}

run()
    .then(() => {
        /**
         * Creates the Listener for exiting of the window.
         */
        document.getElementById("btnCancel").addEventListener('click', (e) => {
            e.preventDefault()

            let confirmation = confirm("Are you sure to exit?\nYou will lose all changes.");
            if (confirmation) {
                window.location = "main_window.html"

            }
        })

        /**
         * Returns true if there's some field that isn't filled.
         */
        let checkIfSomeFieldIsNotFilled = () => {
            if (document.getElementById("title").value == "" || document.getElementById("ingredients").value == "" ||
                document.getElementById("category").value == "" || document.getElementById("prepTime").value == "" ||
                document.getElementById("steps").value == "" || document.getElementById("author").value == "") {
                return true;
            }
        }

        /**
         * Puts all fields of the Form in Blank ready to use it another time.
         */
        let putAllFieldsInBlank = () => {
            document.getElementById("title").value = ""
            document.getElementById("ingredients").value = ""
            document.getElementById("category").value = ""
            document.getElementById("prepTime").value = ""
            document.getElementById("steps").value = ""
            document.getElementById("author").value = ""
        }

        /**
         * Creates the Listener for Submit a recipe doing some checks, if the recipe passes it, the recipe may be uploaded. 
         */
        document.getElementById("btnSubmit").addEventListener('click', async (e) => {
            e.preventDefault()
            if (checkIfSomeFieldIsNotFilled()) {
                dialog.showErrorBox("Error", "All the camps must be filled")
            } else {
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

                await client.connect()
                const result = await recipesCollection.insertOne({
                    name: document.getElementById("title").value,
                    ingredients: document.getElementById("ingredients").value,
                    prepTime: document.getElementById("prepTime").value,
                    author: document.getElementById("author").value,
                    steps: document.getElementById("steps").value,
                    category: categoryNumber
                });
                console.log("[+] Recipe " + document.getElementById("title").value + " has been inserted.");
                putAllFieldsInBlank()
            }
        })
    })
    .catch(console.dir())