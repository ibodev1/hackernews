import db from '../db/index.ts'
import { Item, ItemWithComments, StoryTypes } from "../types.ts";

const getItem = async (itemId: string): Promise<Item | null> => {
    const item = await db.child("item").child(itemId).get();
    if(!item.exists()) return null;
    return item.val() as unknown as Item;
}

const getStories = async (storyType: StoryTypes) => {
    const stories = await db.child(storyType).get();
    if(!stories.exists()) return null;
    return stories.val() as unknown as number[];
}

const getItemWithComments = async (itemId: string): Promise<ItemWithComments | null> => {
    const item = await getItem(itemId);
    if(item) {
        const comments: Item[] = [];
        if(Array.isArray(item?.kids)){
            for (const childId of item.kids) {
                const child = await getItem(childId.toString());
                if(child) comments.push(child);
            }
        }
        const result: ItemWithComments = {
            ...item,
            comments
        }
        return result;
    }

    return null;
}

export {
    getItem,
    getStories,
    getItemWithComments
}