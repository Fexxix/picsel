import mongoose from "mongoose"

const UserModel = mongoose.model(
  "Users",
  new mongoose.Schema(
    {
      _id: {
        type: String,
        required: true,
        unique: true,
      },
      collections: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Collection",
        },
      ],
    },
    {
      _id: false,
    }
  )
)

export default mongoose.models.Users || UserModel
