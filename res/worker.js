this.importScripts("./worker-protocol.js");
this.importScripts("../script.js");

let progressCall = 0;
/**
 * Register script progress
 * @param {Number} ratio - Progress between 0 and 1
 * @param {Boolean} [forced=false] - Force the progression send
 */
function progression (ratio, forced) {
    if (++progressCall % 1e5 === 0 || forced) {
        this.postMessage(new Message(Message.types.progress, ratio));
        progressCall = 0;
    }
}
/**
 * Send a message to UI
 * @param {String} message - Any message
 */
function send (message) {
    this.postMessage(new Message(Message.types.output, message));
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
