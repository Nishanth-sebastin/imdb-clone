import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Actor from '../models/actors.model';
import Movie from '../models/movie.model';
import Producer from '../models/producer.model';
import User from '../models/user.model';
import MovieFeedback from '../models/movieFeedback.model';

dotenv.config();
const seedDatabase = async () => {
  await mongoose.connect(process.env.DATABASE_URL as string, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
  });

  console.log('MongoDB connected successfully.');
  try {
    // Clear existing data
    await Promise.all([
      Actor.deleteMany(),
      Movie.deleteMany(),
      Producer.deleteMany(),
      User.deleteMany(),
      MovieFeedback.deleteMany(),
    ]);

    // Create Users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('password', 10),
      },
      {
        name: 'Jane Doe',
        username: 'jane',
        email: 'jane@example.com',
        password: await bcrypt.hash('password', 10),
      },
    ]);

    // Create Actors
    const actors = await Actor.insertMany([
      {
        name: 'Leonardo DiCaprio',
        imageUrl:
          'https://hips.hearstapps.com/hmg-prod/images/actor-leonardo-dicaprio-talks-at-the-loews-regency-hotel-on-news-photo-72201117-1540327504.jpg?crop=1xw:1xh;center,top&resize=980:*',
      },
      {
        name: 'Margot Robbie',
        imageUrl:
          'https://hips.hearstapps.com/hmg-prod/images/gettyimages-1794117452-65b13b9b4f573.jpg?crop=0.895xw:0.746xh;0.0391xw,0.0306xh&resize=980:*',
      },
    ]);

    // Create Producers
    const producers = await Producer.insertMany([
      {
        name: 'Steven Spielberg',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi86dnS_v65rt9-gxm0UNmW2-IOQKA4CBSug&s',
      },
      {
        name: 'Kathleen Kennedy',
        imageUrl:
          'https://puck.news/wp-content/uploads/2025/02/GettyImages-887401464-scaled-e1740457747519-1088x612.jpg',
      },
    ]);

    // Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'Inception',
        year: 2010,
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        images: [
          'https://cdn.mos.cms.futurecdn.net/N9nCdJHgqde57jcyAnd2KL-600-80.jpg',
          'https://m.media-amazon.com/images/S/pv-target-images/e826ebbcc692b4d19059d24125cf23699067ab621c979612fd0ca11ab42a65cb._SX1080_FMjpg_.jpg',
        ],
        user_id: users[0]._id,
        cast: [
          {
            person: actors[0]._id,
            role: 'actor',
          },
          {
            person: producers[0]._id,
            role: 'producer',
          },
        ],
      },
      {
        title: 'The Wolf of Wall Street',
        year: 2013,
        description: 'Based on the true story of Jordan Belfort.',
        images: [
          'https://images.bauerhosting.com/legacy/empire-tmdb/films/106646/images/dYtAyg4vD88hIfrR1VKDnVGhnE6.jpg?ar=16:9&fit=crop&crop=top',
          'https://i.ytimg.com/vi/ODKm9oIDg_o/maxresdefault.jpg',
        ],
        user_id: users[1]._id,
        cast: [
          {
            person: actors[0]._id,
            role: 'actor',
          },
          {
            person: actors[1]._id,
            role: 'actor',
          },
          {
            person: producers[1]._id,
            role: 'producer',
          },
        ],
      },
    ]);

    // Create Movie Feedback
    await MovieFeedback.insertMany([
      {
        rating: 5,
        review: 'Absolutely mind-blowing!',
        user_id: users[0]._id,
        movie_id: movies[0]._id,
      },
      {
        rating: 4,
        review: 'Great performances!',
        user_id: users[1]._id,
        movie_id: movies[1]._id,
      },
    ]);

    // Update Actors/Producers with movie references
    await Promise.all([
      Actor.findByIdAndUpdate(actors[0]._id, { movies: [movies[0]._id, movies[1]._id] }),
      Actor.findByIdAndUpdate(actors[1]._id, { movies: [movies[1]._id] }),
      Producer.findByIdAndUpdate(producers[0]._id, { movies: [movies[0]._id] }),
      Producer.findByIdAndUpdate(producers[1]._id, { movies: [movies[1]._id] }),
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
