# Math worker

Delegate heavy work (like large math operation) to a worker.

## How to use

Clone this repo and edit [script.js](script.js) with your code.

### inputs()

Function that return the set of inputs needed with "key" as label and "value" as default value.

#### example

```js
function inputs () {
    return {
        ["How many times"]: 1e3,
        String: "test",
        // ...
    };
}
```

### work()

Function that execute your operation. Can output data with ``send()`` or register its progress with ``progression()``.
It receive a parameter with selected inputs value.

#### example

```js
function work (params) {
    // Some all fibonacci numbers to the nth
    const nbLoops = params["How many times"];
    const fibonacci = [1, 1];
    for (let i = 2; i < nbLoops; ++i) {
        progression(i / nbLoops);
        fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }
    const sum = fibonacci.reduce((acc, item) => acc + item, 0);
    send(`Sum: ${sum}`);
}
```
