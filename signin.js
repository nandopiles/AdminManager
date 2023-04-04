const { MongoClient } = require("mongodb");
const { dialog } = require('@electron/remote')
const uri =
    "mongodb+srv://admin:admin@nutgod.adcito8.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);


let admins
let adminsCollection

async function run() {
    await client.connect()
    const database = client.db('Dietet_db');
    adminsCollection = database.collection('admins');
    
    admins = await adminsCollection.find({}).toArray()
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
            await adminsCollection.insertOne(newAdmin)
            console.log("[+] Admin Inserted " + newAdmin)
            window.location = "login.html"
        }

        let deleteData = () => {
            document.getElementById("username-sign").value = ""
            document.getElementById("password1-sign").value = ""
            document.getElementById("password2-sign").value = ""
        }

        let message

        //no email to send
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