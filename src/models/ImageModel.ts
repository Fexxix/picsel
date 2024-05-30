import mongoose from "mongoose"

const ImageModel = mongoose.model(
  "Images",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  })
)

export default mongoose.models.Images || ImageModel
