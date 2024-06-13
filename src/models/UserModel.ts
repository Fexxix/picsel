import mongoose from "mongoose"

interface User extends mongoose.Document {
  _id: string
  collections: mongoose.Types.ObjectId[]
}

const UserSchema = new mongoose.Schema<User>(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collections",
      },
    ],
  },
  {
    _id: false,
  }
)

const UserModel: mongoose.Model<User> =
  mongoose.models.Users || mongoose.model<User>("Users", UserSchema)

export default UserModel
