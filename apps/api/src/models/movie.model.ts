import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'First movie ever made was in 1888!'],
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
      validate: {
        validator: (array) => array.length > 0,
        message: 'At least one image is required',
      },
    },
  ],
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  overall_ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  cast: [
    {
      _id: {
        type: String,
        default: uuidv4,
      },
      person: {
        type: String,
        required: true,
        refPath: 'cast.role',
      },
      role: {
        type: String,
        required: true,
        enum: ['actor', 'producer'], // Match model names
      },
    },
  ],
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
