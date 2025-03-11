import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const producerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: [true, 'Producer name is required'],
    trim: true,
  },
  movies: [
    {
      type: String,
      ref: 'Movie',
    },
  ],
});

const Producer = mongoose.model('Producer', producerSchema);
export default Producer;
