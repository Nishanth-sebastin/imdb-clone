import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: [true, 'Movie name is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'First movie ever made was in 1888!'],
  },
  producerId: {
    type: String,
    required: [true, 'Producer is required'],
    ref: 'Producer',
  },
  actors: [
    {
      type: String,
      required: [true, 'At least one actor is required'],
      ref: 'Actor',
    },
  ],
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
