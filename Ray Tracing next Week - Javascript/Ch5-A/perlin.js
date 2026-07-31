


class Perlin {

    constructor() {

        this.point_count = 256;

        this.randFloat = [];
        this.perm_x = [];
        this.perm_y = [];
        this.perm_z = [];

        for (let i = 0; i < this.point_count; i++) {
            this.randFloat[i] = Vec3.random_unit_vector();
        }

        this.perlin_generate_perm(this.perm_x);
        this.perlin_generate_perm(this.perm_y);
        this.perlin_generate_perm(this.perm_z);
    }


    noise(p){
        var i = Math.floor(4*p.x) & 255 
        var j = Math.floor(4*p.y) & 255 
        var k = Math.floor(4*p.z) & 255

        //this.randFloat=(this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k])
        
        return this.randFloat[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]]
        
    }

    perlin_generate_perm(p) {

        for (let i = 0; i < this.point_count; i++) {
            p[i] = i;
        }

        this.permute(p);
    }

    permute(p) {

        for (let i = p.length - 1; i > 0; i--) {

            let target = Vec3.random_int(0, i);

            let tmp = p[i];
            p[i] = p[target];
            p[target] = tmp;
        }
    }
}

window.Perlin = Perlin;