import mongoose from "mongoose"

const CollectionModel = mongoose.model(
  "Collections",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
  })
)

export default mongoose.models.Collection || CollectionModel
