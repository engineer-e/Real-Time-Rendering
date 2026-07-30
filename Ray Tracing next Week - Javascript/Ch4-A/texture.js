class Texture {
    value(u, v, p) {
        throw new Error("Texture.value() must be implemented");
    }
}

class SolidColor extends Texture {
    constructor(albedo) {
        super();
        this.albedo = albedo;
    }

    value(u, v, p) {
        return this.albedo;
    }
}

class CheckerTexture extends Texture {
    constructor({ scale, even, odd, c1, c2 }) {
        super();

        this.inv_scale = 1.0 / scale;

        // Allow either textures or colors
        this.even = even ?? new SolidColor(c1);
        this.odd = odd ?? new SolidColor(c2);
    }

    value(u, v, p) {
        const xInteger = Math.floor(this.inv_scale * p.x);
        const yInteger = Math.floor(this.inv_scale * p.y);
        const zInteger = Math.floor(this.inv_scale * p.z);

        const isEven = ((xInteger + yInteger + zInteger) % 2) === 0;

        return isEven
            ? this.even.value(u, v, p)
            : this.odd.value(u, v, p);
    }
}

window.Texture = Texture;
window.SolidColor = SolidColor;
window.CheckerTexture = CheckerTexture;