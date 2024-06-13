import mongoose, { Schema } from "mongoose"

export interface Collection extends mongoose.Document {
  name: string
  description: string
  images: mongoose.Types.ObjectId[]
  thumbnail: string
  createdAt: Date
  owner: string
}

const CollectionSchema = new Schema<Collection>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images",
        default: [],
      },
    ],
    owner: {
      type: String,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
)

export const CollectionModel: mongoose.Model<Collection> =
  mongoose.models.Collections ||
  mongoose.model<Collection>("Collections", CollectionSchema)

export default CollectionModel
