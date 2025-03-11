import Producer from '../models/producer.model';

/**
 * Fetch all producers from the database
 * @returns List of producers
 */
export async function getProducers() {
  try {
    return await Producer.find();
  } catch (error) {
    throw new Error(`Error fetching producers: ${(error as Error).message}`);
  }
}

/**
 * Create a new producer in the database
 * @param data Producer details (name, movies)
 * @returns Created producer object
 */
export async function createProducer(data: { name: string; movies?: string[] }) {
  try {
    const producer = new Producer(data);
    return await producer.save();
  } catch (error) {
    throw new Error(`Error creating producer: ${(error as Error).message}`);
  }
}
