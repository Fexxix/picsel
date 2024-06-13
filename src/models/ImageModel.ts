import mongoose from "mongoose";

//@ts-ignore
export interface Image extends mongoose.Document {
  name: string;
  url: string;
  user: string;
  collection: mongoose.Types.ObjectId;
  owner: string;
}

const imageSchema = new mongoose.Schema<Image>({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: "users",
    required: true,
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collections",
    required: true,
  },
  owner: {
    type: String,
    ref: "users",
    required: true,
  },
});

const ImageModel: mongoose.Model<Image> =
  mongoose.models.Images || mongoose.model("Images", imageSchema);

export default ImageModel;
