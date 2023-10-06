import db from "../db/index.ts";
import { User } from "../types.ts";

const getUser = async (userId: string): Promise<User | null> => {
  try {
    const user = await db.child("user").child(userId).get();
    if (!user.exists()) return null;
    return user.val() as unknown as User;
  } catch (_e) {
    return null;
  }
};

export { getUser };
