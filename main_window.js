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
         * Deletes the recipe in the DB and in the array
         * @param {*} element The recipe you want to delete
         * @param {*} index The position of the recipe in the array
         */
        let deleteRecipe = async (element, index) => {
            await client.connect()

            await recipesCollection.deleteOne({ _id: element._id })
            recipes.splice(index, 1)
        }

        /**
         * Creates the Listener for Deleting a recipe
         */
        let createListenersDeleting = (recipesShow) => {
            recipesShow.forEach((element, index) => {
                document.getElementById("btnDelete" + index).addEventListener('click', async (e) => {
                    e.preventDefault()
                    let confirmation = confirm("Are you sure to delete the recipe:\n" + recipesShow[index].name + "?");
                    if (confirmation) {
                        await deleteRecipe(element, index)
                        console.log("[+] Recipe Deleted");
                        showRecipes(recipesShow)
                    } else {
                        console.log("[+] Recipe NOT deleted");
                        return false;
                    }
                })
            });
        }

        /**
         * Creates the Listener for Editing a recipe ()
         */
        let createListenersEditing = (recipesShow) => {
            recipesShow.forEach((recipe, index) => {
                document.getElementById("btnEdit" + index).addEventListener('click', (e) => {
                    e.preventDefault()
                    window.location = "edit_page.html?id=" + recipe._id
                })
            });
        }

        /**
         * Prints all the recipes stored in the DB in a striped list view
         */
        let showRecipes = (recipesShow) => {
            let listRecipes = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Img</th>
                        <th scope="col">Title</th>
                        <th scope="col">Prep Time</th>
                        <th scope="col">Author</th>
                        <th scope="col">Category</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>`

            recipesShow.forEach((element, index) => {
                listRecipes += `
                <tr>
                    <th scope="row"><img class="lists-photos" src="img/DefaultRecipePicture.png" alt="Recipe${index}"></th>
                    <td>${element.name}</td>
                    <td>${element.prepTime}</td>
                    <td>${element.author}</td>`

                let category
                switch (element.category) {
                    case 1:
                        category = `
                        <td>
                            <span class="icon icon-record center good"></span>
                        </td>`
                        break;
                    case 2:
                        category = `
                        <td>
                            <span class="icon icon-record center normal"></span>
                        </td>`
                        break;
                    case 3:
                        category = `
                        <td>
                            <span class="icon icon-record bad"></span>
                        </td>`
                        break;
                }
                listRecipes += category

                listRecipes += `
                    <td>
                        <button type="button" class="btn btn-success" id="btnEdit${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-danger" id="btnDelete${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                            </svg>
                        </button>
                    </td>
                </tr>`
            })

            listRecipes += `
                </tbody>
            </table>
            `
            document.getElementById("gallery").innerHTML = listRecipes

            createListenersDeleting(recipesShow)
            createListenersEditing(recipesShow)
        }

        /**
         * Searches the recipes comparing the input user's written
         */
        document.getElementById("searchBox").addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                let listRecipesFound = []
                recipes.forEach(recipe => {
                    if (recipe.name.toLowerCase().includes(document.getElementById("searchBox").value.toLowerCase())) {
                        listRecipesFound.push(recipe)
                    }
                });
                showRecipes(listRecipesFound)
            }
        })

        /**
         * Button for Logging Out
         */
        document.getElementById("btnLogout").addEventListener('click', (e) => {
            e.preventDefault()
            window.location = "login.html"
        })

        /**
         * Button for Uploading a new recipe
         */
        document.getElementById("btnUploadRecipe").addEventListener('click', (e) => {
            e.preventDefault()
            window.location = "upload_recipe.html"
        })

        /**
         * Button for Listing all Users
         */
        document.getElementById("btnListUsers").addEventListener('click', (e) => {
            e.preventDefault()
            window.location = "list_users.html"
        })

        showRecipes(recipes)
    })
    .catch(console.dir)