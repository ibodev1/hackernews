import db from '../db/index.ts'
import { Item, ItemWithComments, StoryTypes } from '../types.ts'

const getItem = async (itemId: string): Promise<Item | null> => {
  try {
    const itemSnapshot = await db.child('item').child(itemId).get()
    if (!itemSnapshot.exists()) return null
    return itemSnapshot.val() as Item
  } catch {
    return null
  }
}

const getStories = async (storyType: StoryTypes) => {
  try {
    const storySnapshot = await db.child(storyType).get()
    if (!storySnapshot.exists()) return null
    return storySnapshot.val() as number[]
  } catch {
    return null
  }
}

const getItemWithComments = async (
  itemId: string,
): Promise<ItemWithComments | null> => {
  const item = await getItem(itemId)
  if (!item) return null

  const comments = Array.isArray(item.kids)
    ? (await Promise.all(
      item.kids?.map((childId) => getItem(childId.toString())),
    )).filter(Boolean) as Item[]
    : []

  return { ...item, comments }
}

export { getItem, getItemWithComments, getStories }
