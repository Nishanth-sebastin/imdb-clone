import mongoose from 'mongoose';

export const updateReferences = async (movieId: any, personId: string, role: string, operation: '$addToSet' | '$pull') => {
  await mongoose.model(role).updateOne(
    { _id: personId },
    { [operation]: { movies: movieId } }
  );
};

