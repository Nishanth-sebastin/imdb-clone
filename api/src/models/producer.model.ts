import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const producerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Producer name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    movies: [
      {
        type: String,
        ref: 'Movie',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

producerSchema.virtual('filmography', {
  ref: 'Movie',
  localField: 'movies',
  foreignField: '_id',
});
const Producer = mongoose.model('producer', producerSchema);
export default Producer;
