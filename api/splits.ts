export const calculateSplits = (recipeInfo) => {
    let splitvalues = {};
    for (const item in recipeInfo){
        const itemInfo = recipeInfo[item];
        const price = itemInfo.price;
        const splits = itemInfo.splits;
        const splitprice = price / splits.length;
        for (const user of splits){
            if (user in splitvalues){
                splitvalues[user] = splitvalues[user] + splitprice;
            }
            else{
                splitvalues[user] = splitprice;
            }
        }
    }
    return splitvalues;
}