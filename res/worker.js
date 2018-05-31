this.importScripts("./worker-protocol.js");
this.importScripts("../script.js");

let progressCall = 0;
/**
 * Register script progress between 0 and 1
 * @param {Number} ratio
 */
function progression (ratio) {
    if (++progressCall % 1e5 === 0) {
        this.postMessage(new Message(Message.types.progress, ratio));
        progressCall = 0;
    }
}
/**
 * Send a message to UI
 * @param {String} message
 */
function send (message) {
    this.postMessage(new Message(Message.types.output, message));
}

this.onmessage = (message) => {
    switch (message.data.type) {
        case Message.types.start:
            const time = performance.now();
            work(message.data.value);
            this.postMessage(new Message(Message.types.done, performance.now() - time));
            break;
    }
};
