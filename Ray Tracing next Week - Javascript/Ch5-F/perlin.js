


class Perlin {

    constructor() {

        this.point_count = 256;

       
        this.randFloat = [];
        this.perm_x = [];
        this.perm_y = [];
        this.perm_z = [];

        for (let i = 0; i < this.point_count; i++) {
            this.randFloat[i] = Vec3.unit_vector(Vec3.random(-1.0,1.0))
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

        return this.perlin_interp(this.c,u,v,w)
        //this.randFloat=(this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k])
        
        //return this.randFloat[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]]
        
    }
//--------------------------------------------------

   turb(p,depth){
        var accum = 0.0
        var temp_p = p 
        var weight = 1.0 

        for(var i=0;i<depth;i++){
            accum += (weight*this.noise(temp_p))
            weight *= 0.5 
            temp_p = Vec3.mul({t:2,v:temp_p})
        }

        var mag = 1//(Math.random())^255
        var out = new Vec3(Math.abs(accum)*mag,Math.abs(accum)*mag,Math.abs(accum)*mag)

        //return Vec3.random_in_unit_disk()
        //return Vec3.random_unit_vector()

        return out
        //return this.noise(temp_p)
     }

     perlin_interp(c,u,v,w){

           // 5.3Improvement with Hermitian Smoothing

        var p = 3
        var q = 2   
        var uu = u*u*(p-q*u)
        var vv = v*v*(p-q*v)
        var ww = w*w*(p-q*w)
         //--------------------------------------------------

        var accum = 0.0 
        for(var i=0;i<2;i++){
         for(var j=0;j<2;j++){
          for(var k=0;k<2;k++){
            var weight_v = new Vec3(u-i, v-j, w-k)
             var t = (i*uu + (1-i)*(1-uu)) * (j*vv + (1-j) * (1-vv)) * (k*ww + (1-k) * (1-ww))
             var vec =  c[i][j][k]
             //var m = Vec3.mul({t:t,v:Vec3.dot(vec,weight_v)})
             var m = t*Vec3.dot(vec,weight_v)
             accum += m
          }   
         }   
        }
        return accum

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