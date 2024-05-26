const express = require('express');
const { createClient } = require("@libsql/client"); 
const bodyParser = require('body-parser'); 
const cors = require('cors')

const client = createClient({
  url: "libsql://productos-db-alexgoh.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTY3NDMzMjgsImlkIjoiZTkyZDAzOWEtNjYyMi00NWFkLTg3Y2MtZTdkNTFhMTAwMjdkIn0.t22g0Ov4svajCLgVxTDm3yQQQy1EHlY-58t2GL-ihlz71IY-tCPbhafDp6wz2ZpQj_PZYkOvwO7YKIYO5Q1uBw",
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/products', async (req, res) => {
  const products = await client.execute("SELECT * FROM products"); 
    res.json({results: products.rows, info: "ok"});
}); 

app.post('/products', async (req, res) => {
  const { title, price, description, categoryId, image } = req.body;

  const products = await client.execute(`
    INSERT INTO products (title, price, description, categoryId, image) VALUES ("${title}", "${price}", "${description}", "${categoryId}", "${image}");`
  ); 
  res.json({ message: "Product created"});
}); 

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, categoryId, image } = req.body;

  await client.execute(`
    UPDATE products 
    SET title = "${title}", price = "${price}", description = "${description}", categoryId = "${categoryId}", image = "${image}" 
    WHERE id = ${id}
    `); 
  res.json({message: "Product updated"});
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await client.execute(`DELETE FROM products WHERE id = ${id}`); 
  res.json({message: "Product deleted"});
}); 

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
}); 