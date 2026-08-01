


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

        var u = p.x - Math.floor(p.x)
        var v = p.y - Math.floor(p.y)
        var w = p.z - Math.floor(p.z)

        var i = Math.floor(p.x) 
        var j = Math.floor(p.y) 
        var k = Math.floor(p.z)

         this.c = Array.from({ length: 2 }, () =>
              Array.from({ length: 2 }, () => Array(2))
              );

        for(var di=0;di<2;di++){
            for(var dj=0;dj<2;dj++){
                for(var dk=0;dk<2;dk++){
                    this.c[di][dj][dk] =  this.randFloat[this.perm_x[(i+di)&255] ^ this.perm_y[(j+dj)&255] ^ this.perm_z[(k+dk)&255]]
                }
            }
        }

        //console.log(this.c)

        return this.trilinear_interp(this.c,u,v,w)
        //this.randFloat=(this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k])
        
        //return this.randFloat[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]]
        
    }


    trilinear_interp(c,u,v,w){
        var accum = new Vec3(0,0,0) 
        for(var i=0;i<2;i++){
         for(var j=0;j<2;j++){
          for(var k=0;k<2;k++){
             var t = (i*u + (1-i)*(1-u)) * (j*v + (1-j) * (1-v)) * (k*w + (1-k) * (1-w))
             var vec =  c[i][j][k]
             var m = Vec3.mul({t:t,v:vec})
             accum.add_eq(m)
          }   
         }   
        }
        return accum
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