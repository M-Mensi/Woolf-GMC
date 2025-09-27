function mainChecker(sentence) {

    // Initialize counters
    let lengthCounter = 0;
    let wordCounter = 0;
    let vowelsCounter = 0;
    const vowels = "aeiouAEIOU";

    for (let i = 0; i < sentence.length; i++) {
        const char = sentence[i];

        lengthCounter++;
        if (char === ' ' || char === '.') {
            wordCounter++;
        } else if (vowels.includes(char)) {
            vowelsCounter++;
        }
    }
    
    console.log("Length of the string: " + lengthCounter);
    console.log("Number of words: " + (wordCounter));
    console.log("Number of vowels: " + vowelsCounter);
}


// Test the function
mainChecker("Hello World, my name is Mohamed.");