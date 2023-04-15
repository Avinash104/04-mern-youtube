import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      ...req.body,
      password: passwordHash,
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const signinUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ msg: "User does not exit!" })

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch)
      return res.status(400).json({ msg: "Password does not match!" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    // const { password, ...others } = user._doc

    delete user._doc.password
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
