/**
 * Returns a set of inputs to add
 * "key" being the label and "value" the field type and default value
 * @return {Object}
 */
function inputs () {
    return {
        ["Number of characters"]: 4,
    };
}

/**
 * Do the work
 * @param {Object} parameters
 */
function work (parameters) {
    // Example of random string draw (replace this with your code)

    function randomStr (length) {
        // Draw random -> transform it alphaDecimal [1-9a-z] -> cut last n chars
        return Math.random().toString(36).substr(-length);
    }

    const nbChar = parameters["Number of characters"];
    const theoreticalPossibilities = 36 ** nbChar;
    send(`Theoretical: ${theoreticalPossibilities}`);
    const nbLoop = 5 * theoreticalPossibilities;
    const results = {};
    for (let i = 0; i < nbLoop; ++i) {
        const draw = randomStr(nbChar);
        if (results[draw]) {
            ++results[draw];
        }
        else {
            results[draw] = 1;
        }
        progression(i / nbLoop);
    }

    const len = Object.keys(results).length;
    send(`Result: ${len}`);
    send(`Used: ${(len / theoreticalPossibilities).toFixed(2) * 100}%`);

    // end example
}
