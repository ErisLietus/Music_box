import express from "express"
import "dotenv/config"
import { authRouter } from "./routes/auth";
import { errorHandler } from "./routes/error";

const app = express();
const PORT = 8080;



app.use(express.json())
app.use(express.static("./public"))

app.use("/api/auth", authRouter)

app.use(errorHandler)

app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});