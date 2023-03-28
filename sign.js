const { MongoClient } = require("mongodb");
const { dialog } = require('@electron/remote')
const uri =
    "mongodb+srv://admin:admin@nutgod.adcito8.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);


let admins
let usersCollection

async function run() {
    await client.connect()
    const database = client.db('Dietet_db');
    usersCollection = database.collection('admins');
    //paso toda la info de la Colección Users a un Array para trabajar con él
    admins = await usersCollection.find({}).toArray()
    //users.forEach(user => console.log(user))
}

run()
    .then(() => {
        let insertUser = async () => {
            await client.connect()
            let newAdmin = {
                name: document.getElementById("username-sign").value,
                password: document.getElementById("password1-sign").value
            }
            admins.push(newAdmin)
            await usersCollection.insertOne(newAdmin)
            console.log("[+] Admin Inserted " + newAdmin)
        }

        let deleteData = () => {
            document.getElementById("username-sign").value = ""
            document.getElementById("password1-sign").value = ""
            document.getElementById("password2-sign").value = ""
        }

        let message

        //falta comprobación de email
        document.getElementById("btnSign").addEventListener('click', (e) => {
            e.preventDefault()
            if (document.getElementById("password1-sign").value == document.getElementById("password2-sign").value) {
                if (document.getElementById("username-sign").value == "" ||
                    document.getElementById("password1-sign").value == "") {
                    message = "Camps can't be empty"
                    dialog.showErrorBox("Error", message)
                    deleteData()
                    return;
                }
                for (let i = 0; i < admins.length; i++) {
                    if (admins[i].name == document.getElementById("username-sign").value) {
                        message = "Admin already exists"
                        dialog.showErrorBox("Error", message)
                        deleteData()
                        return;
                    }
                }
                insertUser()
            } else {
                message = "Passwords must match!"
                dialog.showErrorBox("Error", message)
            }
        })
    })
    .catch(() => console.dir)
    .finally(() => client.close)