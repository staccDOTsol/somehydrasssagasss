import { Helius } from "helius-sdk";
import fs from 'fs'
const helius = new Helius("0d4b4fd6-c2fc-4f55-b615-a23bab1ffc85");
let count = 1000;
let items: any = []
async function main() {
    let i = 1
    let traitsById: any = {}
while (count == 1000){
const response = await helius.rpc.getAssetsByGroup({
  groupKey: "collection",
  groupValue: "HUN7q1ABF9aBRRAJRW1hUPsu4f4dNQv8CXztRWFF7q7n",
  page: i,
});
i++
items.push(...response.items.map((item) => item.id))
fs.writeFileSync('items.json', JSON.stringify(items))
let rarities = response.items.map((item) => {
    // @ts-ignore 
    for (let i = 0; i < item.content?.metadata?.attributes?.length; i++) {
        // @ts-ignore 
        if (item.content?.metadata?.attributes[i].trait_type.toLowerCase() == "rarity") {
            // @ts-ignore 
            if (!Number.isNaN(parseFloat(item.content?.metadata?.attributes[i].value))) {
            return parseFloat(item.content?.metadata?.attributes[i].value) + 1
            }
            else {
                return 8.3
            
            }
        }
    }
    return 8.3
}
);

console.log(rarities)
let traits = (response.items.map((item) => 
{
let sum = 0 ;
if (item.content?.metadata?.attributes == undefined) return 0;
for (var att of item.content?.metadata?.attributes) {
    console.log(att.value)
    if (!Number.isNaN(parseFloat(att.value))) {
    sum += parseFloat(att.value) 
}
}
return sum * rarities[response.items.indexOf(item)]
}
))
count = response.items.length;
let ids = response.items.map((item) => item.id)
for (let i = 0; i < ids.length; i++) {
//traitsById[ids[i]] = Math.ceil(traits[i])
// apply a wider range logarithmic normalization
if (Math.ceil(Math.log(traits[i] + 1) * 100) > 1522) {
traitsById[ids[i]] = Math.ceil(Math.log(traits[i] + 1) * 100)
}
}

console.log(traitsById)
fs.writeFileSync('traits.json', JSON.stringify(traitsById))
// console log sum of traitsById values
let sum = 0;
for (let i of Object.values(traitsById)) {
    // @ts-ignore
    sum += i 

}
console.log(sum)
// do statistical analysis; min max mean median mode
let min = Infinity;
let max = -Infinity;
let mean = 0;
let median = 0;
let mode = 0;
let modeCount = 0;
let modeArray = []
for (let i of Object.values(traitsById)) {
    // @ts-ignore
    if (i < min) min = i
    // @ts-ignore
    if (i > max) max = i
    // @ts-ignore
    mean += i
    // @ts-ignore
    modeArray.push(i)

}
mean /= Object.values(traitsById).length
modeArray.sort()
console.log(modeArray)
let currentCount = 1;
for (let i = 0; i < modeArray.length; i++) {
    if (modeArray[i] == modeArray[i + 1]) {
        currentCount++
    }
    else {
        if (currentCount > modeCount) {
            modeCount = currentCount
            // @ts-ignore
            mode = modeArray[i]
        }
        currentCount = 1
    }


}
console.log("min: " + min)
console.log("max: " + max)
console.log("mean: " + mean)
console.log("median: " + median)
console.log("mode: " + mode)
console.log("mode count: " + modeCount)

console.log("modeArray len " + modeArray.length)
// remove anything 14 or less from the set; redo statistical analysis
let newTraitsById: any = {}
let newSum = 0;
let newMin = Infinity;
let newMax = -Infinity;
let newMean = 0;
let newMedian = 0;
let newMode = 0;
let newModeCount = 0;
let newModeArray = []
for (let i of Object.entries(traitsById)) {
    // @ts-ignore
    if (i[1] > 1522) {
        // @ts-ignore
        newTraitsById[i[0]] = i[1]
        // @ts-ignore
        newSum += i[1]
        // @ts-ignore
        newModeArray.push(i[1])
        // @ts-ignore
        if (i[1] < newMin) newMin = i[1]
        // @ts-ignore
        if (i[1] > newMax) newMax = i[1]
    }

}
newMean = newSum / Object.values(newTraitsById).length
newModeArray.sort()
console.log(newModeArray)
let newCurrentCount = 1;
for (let i = 0; i < newModeArray.length; i++) {
    if (newModeArray[i] == newModeArray[i + 1]) {
        newCurrentCount++
    }
    else {
        if (newCurrentCount > newModeCount) {
            newModeCount = newCurrentCount
            // @ts-ignore
            newMode = newModeArray[i]
        }
        newCurrentCount = 1
    }

}
console.log("new min: " + newMin)
console.log("new max: " + newMax)
console.log("new mean: " + newMean)
console.log("new median: " + newMedian)
console.log("new mode: " + newMode)
console.log("new mode count: " + newModeCount)
console.log("newModeArray len " + newModeArray.length)
// remove anything 14 or less from the set; redo statistical analysis
}
}
main()