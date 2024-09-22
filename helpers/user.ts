import db from '../db/index.ts';
import { User } from '../types/types.ts';

const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userSnapshot = await db.child('user').child(userId).get();
    return userSnapshot.exists() ? (userSnapshot.val() as User) : null;
  } catch {
    return null;
  }
};

export { getUser };
