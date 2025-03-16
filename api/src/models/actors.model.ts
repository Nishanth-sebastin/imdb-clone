import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

actorSchema.virtual('filmography', {
  ref: 'Movie',
  localField: 'movies',
  foreignField: '_id',
});

const Actor = mongoose.model('actor', actorSchema);
export default Actor;
