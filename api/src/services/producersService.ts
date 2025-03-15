import Producer from '../models/producer.model.js';

/**
 * Fetch all producers from the database
 * @returns List of producers
 */
export async function getProducers(searchText: string) {
  try {
    return await Producer.find({ name: { $regex: searchText, $options: 'i' } }).select('_id name');
  } catch (error) {
    throw new Error(`Error fetching producers: ${(error as Error).message}`);
  }
}

/**
 * Fetch single producer from the database
 * @returns List single producer object
 */
export async function getProducerById(id: string) {
  try {
    const producer = await Producer.findById(id);
    if (!producer) throw new Error('Producer not found');
    return producer;
  } catch (error) {
    throw new Error(`Error fetching producers: ${(error as Error).message}`);
  }
}

/**
 * Create a new producer in the database
 * @param data Producer details (name, movies)
 * @returns Created producer object
 */
export async function createProducer(producerData: any) {
  try {
    const producer = new Producer(producerData);
    return await producer.save();
  } catch (error) {
    throw new Error(`Error creating producer: ${(error as Error).message}`);
  }
}
