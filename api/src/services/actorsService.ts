import Actor from '../models/actors.model.js';

/**
 * Fetch all actors from the database
 * @returns List of actors
 */
export async function getActors(searchText: string) {
  try {
    const actors = await Actor.find({ name: { $regex: searchText, $options: 'i' } }).select('_id name');
    return actors;
  } catch (error) {
    console.error('❌ Error fetching actors:', error);
    throw new Error(`Error fetching actors: ${(error as Error).message}`);
  }
}

/**
 * Fetch single actor from the database
 * @returns List Single actor object
 */
export async function getActorById(id: string) {
  try {
    const actor = await Actor.findById(id).select('_id name imageUrl');
    return actor;
  } catch (error) {
    console.error('❌ Error fetching actor:', error);
    throw new Error(`Error fetching actor: ${(error as Error).message}`);
  }
}

/**
 * Create a new actor in the database
 * @param data Actor details (name, movies)
 * @returns Created actor object
 */
export async function createActor(actorData: any) {
  try {
    const actor = new Actor(actorData);
    return await actor.save();
  } catch (error) {
    throw new Error(`Error creating actor: ${(error as Error).message}`);
  }
}
