class Message {
    constructor (type, value) {
        this.type = type;
        this.value = value;
    }

    /**
     * @typedef {Object} MessageTypes
     * @prop {String} start
     * @prop {String} progress
     * @prop {String} output
     * @prop {String} done
     */
    /**
     * @return MessageTypes
     */
    static get types () {
        return {
            start: "start",
            progress: "progress",
            output: "output",
            done: "done"
        };
    }
}
