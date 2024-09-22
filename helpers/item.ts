import db from '../db/index.ts';
import { Item, ItemWithComments, StoryTypes } from '../types/types.ts';

const getItem = async (itemId: string): Promise<Item | null> => {
  try {
    const itemSnapshot = await db.child('item').child(itemId).get();
    return itemSnapshot.exists() ? itemSnapshot.val() as Item : null;
  } catch {
    return null;
  }
};

const getStories = async (storyType: StoryTypes): Promise<number[] | null> => {
  try {
    const storySnapshot = await db.child(storyType).get();
    return storySnapshot.exists() ? storySnapshot.val() as number[] : null;
  } catch {
    return null;
  }
};

const getItemWithComments = async (
  itemId: string,
): Promise<ItemWithComments | null> => {
  const item = await getItem(itemId);
  if (!item) return null;

  let comments: Item[] = [];

  if (Array.isArray(item.kids)) {
    const commentsPromises = item.kids.map((childId) => getItem(String(childId)));
    const itemComments = await Promise.all(commentsPromises);
    comments = itemComments.filter<Item>((comment): comment is Item => Boolean(comment));
  }

  return { ...item, comments };
};

export { getItem, getItemWithComments, getStories };
