import Actor from '../models/actors.model';

/**
 * Fetch all actors from the database
 * @returns List of actors
 */
export async function getActors() {
  try {
    const actors = await Actor.find(); // Explicitly execute the query\
    return actors;
  } catch (error) {
    console.error('❌ Error fetching actors:', error);
    throw new Error(`Error fetching actors: ${(error as Error).message}`);
  }
}

/**
 * Create a new actor in the database
 * @param data Actor details (name, movies)
 * @returns Created actor object
 */
export async function createActor(data: { name: string; movies?: string[] }) {
  try {
    const actor = new Actor(data);
    return await actor.save();
  } catch (error) {
    throw new Error(`Error creating actor: ${(error as Error).message}`);
  }
}
