import Fuse from "fuse.js";

export const matchWords = (receiptItems, groceryListItems, groceryItemObjects, threshold = 0.3) => {
    const fuse = new Fuse(groceryListItems, { threshold });
    const usedWords = new Set();

    let listOfItems = Object.keys(receiptItems).map(word => {
        const results = fuse.search(word);
        const bestMatch = results.find(r => !usedWords.has(r.item));

        if (bestMatch) {
            usedWords.add(bestMatch.item);
            let splits = [];
            for (let i = 0; i < groceryItemObjects.length; i++) {
                if (groceryItemObjects[i].name == bestMatch.item) {
                    splits = groceryItemObjects[i].splits
                }
            }
            return { receiptItem: word, groceryItem: bestMatch.item, price: receiptItems[word], splits: splits }; // word is from the receiptItems, bestMatch is from groceryListItems
        }
        return { receiptItem: word, groceryItem: "", price: receiptItems[word], splits: [] };
    });

    return listOfItems.reduce((obj, item) => {
        let itemId = window.crypto.randomUUID();
        obj[itemId] = item;
        return obj;
    }, {});
};

// https://chatgpt.com/c/67b11891-1e2c-8009-86bf-ee0c7c6b02a8

// matchWords(["apple", "banana", "cherry"], ["aple", "banana", "cherry"])