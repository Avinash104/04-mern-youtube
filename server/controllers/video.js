import { createError } from "../error.js"
import Video from "../models/Video.js"

const addVideo = async (req, res, next) => {
  try {
    const userId = req.user.id
    const newVideo = new Video({
      userId,
      ...req.body,
    })
    const savedVideo = await newVideo.save()
    res.status(201).json(savedVideo)
  } catch (err) {
    next(err)
  }
}

const updateVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id)
  if (req.user.id != video.userId)
    return next(createError(403, "You can update only your account!"))
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedVideo)
  } catch (err) {
    next(err)
  }
}

const getVideo = async (req, res, next) => {
  console.log("Get video")
  try {
    const video = await Video.findById(req.params.id)
    res.status(200).json(video)
  } catch (err) {
    next(error)
  }
}

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return next(createError(404, "Video not found!"))
    if (req.user.id != video.userId)
      return next(createError(403, "You can update only your account!"))

    await Video.findByIdAndDelete(req.params.id)
    res.status(200).json("The video has been deleted.")
  } catch (err) {
    next(err)
  }
}

export { addVideo, updateVideo, deleteVideo, getVideo }
