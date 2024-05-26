const express = require('express');
const { createClient } = require("@libsql/client"); 
const bodyParser = require('body-parser'); 
const cors = require('cors')

const client = createClient({
  url: "libsql://testclass2-jgaviria0.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTUzOTQyMTEsImlkIjoiMTU2YmE0OTAtNTMwMy00YjYyLWI5MTMtYmRjNjc3ZWEyZTcwIn0.wtU8fNLE7PrOmTKyeDBpsT-nWP94V2YSdQ0B4zIxFSskYSD4Pzjw1HSyTuJFaBJ1FeJqwizuz7VQErf9WWQKDA",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/characters', async (req, res) => {
  const characters = await client.execute("SELECT * FROM characters"); 
    res.json({results: characters.rows, info: "ok"});
}); 

app.post('/characters', async (req, res) => {
  const { name, status, image } = req.body;

  const characters = await client.execute(`
    INSERT INTO characters (name, status, image) VALUES ("${name}", "${status}", "${image}");`
  ); 
  res.json({ message: "Character created"});
}); 

// app.put(''){

// }

app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  await client.execute(`DELETE FROM characters WHERE id = ${id}`); 
  res.json({message: "Character deleted"});
}); 

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
}); 