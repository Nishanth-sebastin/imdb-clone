import mongoose from 'mongoose';
import { updateMovieRating } from '../services/movieFeedback.js';
import { v4 as uuidv4 } from 'uuid';

const movieFeedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  movie_id: {
    type: String,
    required: true,
    ref: 'Movie',
  },
});

movieFeedbackSchema.post('save', function (doc) {
  updateMovieRating(doc.movie_id).catch(console.error);
});

// movieFeedbackSchema.post('deleteOne', { document: true }, function (doc) {
//   updateMovieRating(doc.movie_id).catch(console.error);
// });


const MovieFeedback = mongoose.model('MovieFeedback', movieFeedbackSchema);
export default MovieFeedback;
