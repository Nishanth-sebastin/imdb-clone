import User from '../models/user.model';

/**
 * Fetch single user from the database
 * @returns single user
 */
export async function getUser(userData: any) {
  try {
    const user = await User.findById(userData.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    return { name: user.name, email: user.email };
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    throw new Error(`Error fetching user: ${(error as Error).message}`);
  }
}
