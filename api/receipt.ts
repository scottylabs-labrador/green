import Fuse from "fuse.js";

export const matchWords = (receiptItems, groceryListItems, threshold = 0.3) => {
    const fuse = new Fuse(groceryListItems, { threshold });
    const usedWords = new Set();

    return receiptItems.map(word => {
        const results = fuse.search(word);
        const bestMatch = results.find(r => !usedWords.has(r.item));

        if (bestMatch) {
            usedWords.add(bestMatch.item);
            return { word, bestMatch: bestMatch.item }; // word is from the receiptItems, bestMatch is from groceryListItems
        }
        return { word, bestMatch: null };
    });
};

// https://chatgpt.com/c/67b11891-1e2c-8009-86bf-ee0c7c6b02a8

// matchWords(["apple", "banana", "cherry"], ["aple", "banana", "cherry"])