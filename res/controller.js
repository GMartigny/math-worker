// This shit is ugly because not going to be maintained further
{
    let html = "";
    const fields = window.inputs ? window.inputs() : {};
    Object.keys(fields).forEach((key, index) => {
        html += ((strings, id, key, field) => {
            let input = "";
            const value = typeof field === "function" ? field() : field;
            switch (typeof value) {
                case "string":
                    input += `<input class="input" type="text" name="${key}" id="${id}" value="${value}"/>`;
                    break;
                case "number":
                    input += `<input class="input" type="number" name="${key}" id="${id}" value="${value}"/>`;
                    break;
                case "boolean":
                    input += `<input type="checkbox" name="${key}" id="${id}" ${value ? "checked" : ""} value="1"/>`;
                    break;
                case "object":
                    if (value instanceof Date) {
                        input += `<input class="input" type="date" name="${key}" id="${id}" value="${value.toISOString().split("T")[0]}"/>`;
                    }
                    else {
                        const items = Array.isArray(value) ? value : Object.values(value);
                        input += `<div class="select"><select name="${key}" id="${id}">${items.map(i => `<option>${i}</option>`)}</select></div>`;
                    }
                    break;
            }

            return strings[0] + id + strings[1] + key + strings[2] + input + strings[3];
        })`<div class="field">
                <label class="label" for="${"inp" + index}">${key}</label>
                <div class="control">${fields[key]}</div>
            </div>`;
    });
    const inputNode = document.getElementById("input");
    inputNode.innerHTML = html;
    inputNode.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    const progressBar = document.getElementById("progressbar");
    const controlNode = document.getElementById("control");
    const outputNode = document.getElementById("output");

    function progress(value) {
        const formatted = value.toFixed(1);
        progressBar.setAttribute("value", formatted);
        progressBar.dataset.progress = formatted + "%";
    }
    function start () {
        controlNode.classList.add("is-danger");
        controlNode.innerText = "Stop";
        progress(0);
        progressBar.classList.add("shown");
    }
    function stop () {
        controlNode.classList.remove("is-danger");
        controlNode.innerText = "Start";
        progressBar.classList.remove("shown");
    }
    function output(message) {
        const item = document.createElement("li");
        item.innerText = message;
        outputNode.appendChild(item);
    }
    function formatTime (value) {
        const units = {
            s: 1000,
            mn: 60,
            hr: 60,
            day: 24,
        };
        let lastUnit = "ms";
        let divider = 1;
        for (let key in units) {
            if (value / divider > units[key]) {
                lastUnit = key;
                divider *= units[key];
            }
            else {
                break;
            }
        }
        return (value / divider).toFixed(1) + lastUnit;
    }
    class WorkerProxy {
        constructor () {
            this._buildWorker();
        }
        _buildWorker () {
            this.worker = new Worker("./res/worker.js");

            this.worker.onmessage = (message) => {
                let text;

                switch (message.data.type) {
                    case Message.types.progress:
                        progress(message.data.value * 100);
                        break;
                    case Message.types.output:
                        text = message.data.value;
                        break;
                    case Message.types.done:
                        progress(100);
                        text = `-- Done in ${formatTime(message.data.value)} --`;
                        stop();
                        break;
                }

                if (text) {
                    output(text);
                }
            };
        }

        send (message) {
            this.worker.postMessage(message);
        }
        stop () {
            this.worker.terminate();
            this.worker = null;
            this._buildWorker();

            const progress = progressBar.getAttribute("value");
            output(`-- Canceled at ${progress}% --`);
        }
    }
    const worker = new WorkerProxy();

    controlNode.addEventListener("click", () => {
        if (controlNode.classList.contains("is-danger")) {
            worker.stop();
            stop();
        }
        else {
            outputNode.innerHTML = "";
            start();

            const message = new Message(Message.types.start, Array.from(new FormData(inputNode)).reduce((acc, item) => {
                acc[item[0]] = item[1];
                return acc;
            }, {}));
            worker.send(message);
        }
    });
}
