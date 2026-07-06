import express from "express"
import "dotenv/config"

const app = express();
const PORT = 8080;


app.use(express.json())
app.use(express.static("./public"))
app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});