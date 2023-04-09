const { MongoClient } = require("mongodb");
const { dialog } = require('@electron/remote')
const uri =
    "mongodb+srv://admin:admin@nutgod.adcito8.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);

let usersCollection
let users

async function run() {
    try {
        const database = client.db('Dietet_db');
        usersCollection = database.collection('users');

        users = await usersCollection.find({}).toArray()
        users.forEach(user => console.log(user))
    } finally {
        await client.close();
    }
}

run()
    .then(() => {
        /**
         * Deletes the User passed by parametre in the DB and in the array
         * @param {*} element The user you want to delete
         * @param {*} index The position of the user in the array
         */
        let deleteUser = async (element, index) => {
            await client.connect()

            await usersCollection.deleteOne({ _id: element._id }, function (err, result) {
                if (err) throw err;
                console.log(result);
            })
            users.splice(index, 1)
        }

        /**
         * Creates the Listener for Deleting a user
         */
        let createListenersDeleting = () => {
            users.forEach((element, index) => {
                document.getElementById("btnDelete" + index).addEventListener('click', async (e) => {
                    e.preventDefault()
                    let confirmation = confirm("Are you sure to delete the User:\n" + users[index].name + "?");
                    if (confirmation) {
                        await deleteUser(element, index)
                        console.log("[+] User Deleted");
                        listUsers()
                    } else {
                        console.log("[+] User NOT deleted");
                        return false;
                    }
                })
            })
        }

        /**
         * Lists all Users of the Collection 'Users'
         */
        let listUsers = () => {
            let usersList = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Img</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>`

            users.forEach((element, index) => {
                usersList += `
                <tr>
                    <th scope="row"><img class="lists-photos" src="img/DefaultProfilePicture.png" alt="User${index}"></th>
                    <td>${element.name}</td>
                    <td>${element.email}</td>`

                //buttons for Deleting users
                usersList += `
                    <td>
                    <button type="button" class="btn btn-outline-danger" id="btnDelete${index}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                                </svg>
                            </button>
                    </td>
                </tr>`
            })
            usersList += `
                </tbody>
            </table>
            `
            document.getElementById("listContainer").innerHTML = usersList
            createListenersDeleting()
        }

        /**
         * Listener for Exiting of the List User Page to the Main Window
         */
        document.getElementById("btnExit").addEventListener('click', (e) => {
            e.preventDefault()
            window.location = "main_window.html"
        })
        listUsers()
    })
    .catch(console.dir);