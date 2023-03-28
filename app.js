const { MongoClient } = require("mongodb")

const uri =
    "mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true"

const client = new MongoClient(uri)

//ESTO NO HACE NADA AÚN

async function run() {
    try {
        const database = client.db('new_social-network');
        const usersCollection = database.collection('users');

        const projection = { _id: 0, name: 1, surname: 1 }
        const cursor = await usersCollection.find({}).project(projection);
        await cursor.forEach(console.dir)
    } finally {
        await client.close()
    }
}

run().catch(console.dir)