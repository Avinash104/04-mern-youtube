import express from "express"
import { signinUser, signupUser } from "../controllers/auth.js"

const router = express.Router()

//signup
router.post("/signup", signupUser)
//signin
router.post("/signin", signinUser)

//google

export default router
