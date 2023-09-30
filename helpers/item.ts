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
    if(item && Array.isArray(item?.kids)) {
        const comments: Item[] = [];
        for (const chlidId of item.kids) {
            const chlid = await getItem(chlidId.toString());
            if(chlid) comments.push(chlid);
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