function maxArray(arr) {
    if (arr.length === 0) {
        return null;
    }
    return Math.max(...arr);
}

function minArray(arr) {
    if (arr.length === 0) {
        return null;
    }
    return Math.min(...arr);
}

function sumArray(arr) {
    let sum = 0;
    for (let num of arr) {
        sum += num;
    }
    return sum;
}

function filterArray(arr, minimum, maximum) {
    return arr.filter(num => num > minimum && num < maximum);
}