import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.model.js';
import Actor from '../models/actors.model.js';
import Movie from '../models/movie.model.js';
import Producer from '../models/producer.model.js';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/yourDatabase';

async function seedDatabase() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Drop the entire database
    await mongoose.connection.dropDatabase();
    console.log('✅ Database dropped');

    // Seed Users
    const users = await User.insertMany([
      {
        _id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
      },
      {
        _id: uuidv4(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
      },
    ]);
    console.log('✅ Users seeded');

    // Seed Producers
    const producers = await Producer.insertMany([
      {
        _id: uuidv4(),
        name: 'Christopher Nolan',
      },
      {
        _id: uuidv4(),
        name: 'Quentin Tarantino',
      },
    ]);
    console.log('✅ Producers seeded');

    // Seed Movies
    const movies = await Movie.insertMany([
      {
        _id: uuidv4(),
        name: 'Inception',
        year: 2010,
        producerId: producers[0]._id,
      },
      {
        _id: uuidv4(),
        name: 'Pulp Fiction',
        year: 1994,
        producerId: producers[1]._id,
      },
    ]);
    console.log('✅ Movies seeded');

    // Seed Actors (with movie references)
    const actors = await Actor.insertMany([
      {
        _id: uuidv4(),
        name: 'Leonardo DiCaprio',
        movies: [movies[0]._id],
      },
      {
        _id: uuidv4(),
        name: 'Samuel L. Jackson',
        movies: [movies[1]._id],
      },
    ]);
    console.log('✅ Actors seeded');

    // Update movies with actor references
    await Movie.updateMany({ _id: movies[0]._id }, { $set: { actors: [actors[0]._id] } });
    await Movie.updateMany({ _id: movies[1]._id }, { $set: { actors: [actors[1]._id] } });
    console.log('✅ Movie-Actor relationships updated');

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
  } finally {
    // await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit();
  }
}

seedDatabase();
