// Calculate Median
export const median = (array: Array<number>): number => {
    // Check If Data Exists
    if (array.length >= 1) {
        // Sort Array
        array = array.sort((a: number, b: number) => {
            return a - b;
        });

        // Array Length: Even
        if (array.length % 2 === 0) {
            // Average Of Two Middle Numbers
            return (array[array.length / 2 - 1] + array[array.length / 2]) / 2;
        }
        // Array Length: Odd
        else {
            // Middle Number
            return array[(array.length - 1) / 2];
        }
    } else {
        throw new Error('expected a filled array');
    }
};
