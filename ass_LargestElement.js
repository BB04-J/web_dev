function LargestElement(numbers) {

    if (numbers.length === 0) {
        return null; // or throw error
    }
    let max = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];

        }
    }
    return max;
}