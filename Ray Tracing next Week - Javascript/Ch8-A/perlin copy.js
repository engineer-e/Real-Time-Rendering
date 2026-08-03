// class Perlin{
//     constructor(){
//         this.point_count = 256
//         this.randFloat = []
//         this.perm_x = []
//         this.perm_y = [] 
//         this.perm_z = []

//         for(var i=0;i<this.point_count;i++){
//             this.randFloat[i] = Vec3.random_double()
//         }

//         this.perlin_generate_perm(this.perm_x)
//         this.perlin_generate_perm(this.perm_y)
//         this.perlin_generate_perm(this.perm_z)
        
//     }

//     noise(p){
//         var i = Math.floor(4*p.x) & 255 
//         var j = Math.floor(4*p.y) & 255 
//         var k = Math.floor(4*p.z) & 255
//         return this.randFloat[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]]
//     }

//     perlin_generate_perm(p){
//         for(var i=0;i<this.point_count;i++){
//             p[i] = i 
//         }
        
//         this.permute(p, this.point_count)
//     }

//     permute(p,n){
//         for(var i=n-1; i > 0; i--){
//             var target = Vec3.random_int(0,i)
//             var temp = p[i]
//             p[i] = p[target]
//             p[target] = temp
//         }
//     }

// }

// window.Perlin = Perlin 


class Perlin {

    constructor() {

        this.point_count = 5;

        this.randFloat = [];
        this.perm_x = [];
        this.perm_y = [];
        this.perm_z = [];

        for (let i = 0; i < this.point_count; i++) {
            this.randFloat[i] = Vec3.random();
        }

        this.perlin_generate_perm(this.perm_x);
        this.perlin_generate_perm(this.perm_y);
        this.perlin_generate_perm(this.perm_z);
    }

    // noise(p) {

    //     let u = p.x - Math.floor(p.x);
    //     let v = p.y - Math.floor(p.y);
    //     let w = p.z - Math.floor(p.z);

    //     // Hermite smoothing
    //     u = u * u * (3 - 2 * u);
    //     v = v * v * (3 - 2 * v);
    //     w = w * w * (3 - 2 * w);

    //     let i = Math.floor(p.x);
    //     let j = Math.floor(p.y);
    //     let k = Math.floor(p.z);

    //     let c = [[], []];

    //     for (let di = 0; di < 2; di++) {
    //         c[di] = [[], []];

    //         for (let dj = 0; dj < 2; dj++) {

    //             for (let dk = 0; dk < 2; dk++) {

    //                 let idx =
    //                     this.perm_x[(i + di) & 255] ^
    //                     this.perm_y[(j + dj) & 255] ^
    //                     this.perm_z[(k + dk) & 255];

    //                 c[di][dj][dk] = this.randVec[idx];
    //             }
    //         }
    //     }

    //     return this.perlin_interp(c, u, v, w);
    // }

    perlin_interp(c, u, v, w) {

        let accum = 0;

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {

                    let weight = new Vec3(
                        u - i,
                        v - j,
                        w - k
                    );

                    accum +=
                        (i * u + (1 - i) * (1 - u)) *
                        (j * v + (1 - j) * (1 - v)) *
                        (k * w + (1 - k) * (1 - w)) *
                        Vec3.dot(c[i][j][k], weight);
                }
            }
        }

        return accum;
    }

    turbulence(p, depth = 7) {

        let accum = 0;
        let temp = new Vec3(p.x, p.y, p.z);
        let weight = 1.0;

        for (let i = 0; i < depth; i++) {

            accum += weight * this.noise(temp);

            temp = Vec3.mul({ t: 2, v: temp });
            weight *= 0.5;
        }

        return Math.abs(accum);
    }

    noise(p){
        var i = Math.floor(4*p.x) & 255 
        var j = Math.floor(4*p.y) & 255 
        var k = Math.floor(4*p.z) & 255

        //this.randFloat=[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]]
        
        return this.randFloat
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