import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/users.js"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())
/** Routes */
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
// app.use("/api/videos", userRouter)
// app.use("/api/comments", userRouter)

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || "Something went wrong!!"

  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

/** Mongo DB setup */
const url = process.env.MONGO_URL
const port = process.env.PORT

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ")
    app.listen(port, () => {
      console.log(`App listening on the port ${port}`)
    })
  })
  .catch((err) => {
    console.error(`Error connecting to 
     database. ${err}`)
  })
