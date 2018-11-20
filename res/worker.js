this.importScripts("./worker-protocol.js");
this.importScripts("../script.js");

const progressDelay = 100;
let lastProgress = -progressDelay;
/**
 * Register script progress
 * @param {Number} ratio - Progress between 0 and 1
 * @param {Boolean} [forced=false] - Force the progression send
 */
function progression (ratio, forced) {
    const now = performance.now();
    if (now - lastProgress > 100 || forced) {
        this.postMessage(new Message(Message.types.progress, ratio));
        lastProgress = now;
    }
}
/**
 * Send a message to UI
 * @param {String} message - Any message
 */
function send (message) {
    if (Array.isArray(message)) {
        message.forEach(m => send(m));
    }
    else {
        this.postMessage(new Message(Message.types.output, message));
    }
}

this.onmessage = (message) => {
    switch (message.data.type) {
        case Message.types.start:
            const time = performance.now();
            try {
                send(work(message.data.value));
            }
            catch (e) {
                console.error(e);
                send(e.message);
            }
            this.postMessage(new Message(Message.types.done, performance.now() - time));
            break;
    }
};
