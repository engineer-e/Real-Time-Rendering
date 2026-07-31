class UI {
    constructor(canvas, runner) {
        this.runner = runner;

        const container = canvas.parentElement;

        this.toolbar = document.createElement("div");
        this.toolbar.style.position = "absolute";
        this.toolbar.style.top = "10px";
        this.toolbar.style.left = "10px";
        this.toolbar.style.display = "flex";
        this.toolbar.style.gap = "6px";

        this.playBtn = this.createButton("Play", () => runner.play());
        this.pauseBtn = this.createButton("Pause", () => runner.pause());
        this.stopBtn = this.createButton("Stop", () => runner.stop());

        this.toolbar.append(
            this.playBtn,
            this.pauseBtn,
            this.stopBtn
        );

        container.appendChild(this.toolbar);
    }

    createButton(text, onclick) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = onclick;
        return btn;
    }
}

window.UI = UI