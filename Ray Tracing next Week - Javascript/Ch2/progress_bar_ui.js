class ProgressUI {
    constructor() {
        this.box = document.createElement("div");
        this.box.style.cssText = `
            position:fixed;
            top:20px;
            left:20px;
            width:320px;
            padding:10px;
            background:#222;
            color:#fff;
            border-radius:6px;
            font:14px Arial;
            box-shadow:0 0 10px rgba(0,0,0,.4);
            z-index:9999;
        `;

        this.label = document.createElement("div");
        this.label.style.marginBottom = "6px";

        this.bar = document.createElement("progress");
        this.bar.max = 100;
        this.bar.value = 0;
        this.bar.style.width = "100%";
        this.bar.style.height = "20px";

        this.box.appendChild(this.label);
        this.box.appendChild(this.bar);

        document.body.appendChild(this.box);
    }

    update(percent, remaining) {
        this.bar.value = percent;
        this.label.textContent =`Progress: ${percent}% | Scanlines Remaining: ${remaining}`;
    }

    close() {
        this.box.remove();
    }
}

window.ProgressUI =ProgressUI