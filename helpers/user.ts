import db from '../db/index.ts'
import { User } from '../types.ts'

const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userSnapshot = await db.child('user').child(userId).get()
    if (!userSnapshot.exists()) return null
    return userSnapshot.val() as User
  } catch {
    return null
  }
}

export { getUser }
