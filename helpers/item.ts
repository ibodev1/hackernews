import db from '../db/index.ts'
import { Item, ItemWithComments, StoryTypes } from '../types.ts'

const getItem = async (itemId: string): Promise<Item | null> => {
  try {
    const item = await db.child('item').child(itemId).get()
    if (!item.exists()) return null
    return item.val() as unknown as Item
  } catch (_e) {
    return null
  }
}

const getStories = async (storyType: StoryTypes) => {
  try {
    const stories = await db.child(storyType).get()
    if (!stories.exists()) return null
    return stories.val() as unknown as number[]
  } catch (_e) {
    return null
  }
}

const getItemWithComments = async (
  itemId: string,
): Promise<ItemWithComments | null> => {
  const item = await getItem(itemId)
  if (item) {
    let comments: Item[] = []
    const commentsAsyncArray: Promise<Item | null>[] = []
    if (Array.isArray(item?.kids)) {
      for (const childId of item.kids) {
        commentsAsyncArray.push(getItem(childId.toString()))
      }
      comments = (await Promise.all(commentsAsyncArray)).filter((q) =>
        q !== null
      ) as Item[]
    }
    const result: ItemWithComments = {
      ...item,
      comments,
    }
    return result
  }

  return null
}

export { getItem, getItemWithComments, getStories }
