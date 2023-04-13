import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/Video.js"

const updateUser = async (req, res, next) => {
  if (req.params.id != req.user.id)
    return next(createError(403, "You can update only your account!"))

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )

    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
}

const deleteUser = async (req, res, next) => {
  if (req.params.id != req.user.id)
    return next(createError(403, "You can only delete your account!"))

  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "User has been deleted!!" })
  } catch (err) {
    next(err)
  }
}
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (user === null)
      return res.status(200).json({ message: "User no longer exists!!" })
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
const subscribe = async (req, res, next) => {
  console.log(req.params)
  console.log(req.user.id)
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    })
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } })

    res.status(200).json({ message: "Subscription sucessful!!" })
  } catch (err) {
    next(err)
  }
}
const unsubscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    })
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } })

    res.status(200).json({ message: "Unsubscription sucessful!!" })
  } catch (err) {
    next(err)
  }
}
const like = async (req, res) => {
  console.log(req.body)
}
const dislike = async (req, res) => {
  console.log(req.body)
}

export {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  updateUser,
}
