import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const actorSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  movies: [
    {
      type: String,
      ref: 'Movie',
    },
  ],
});

const Actor = mongoose.model('Actor', actorSchema);
export default Actor;
