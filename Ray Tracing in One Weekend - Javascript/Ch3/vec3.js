class Vec3{
    constructor(x,y,z){
        this.e=[x,y,z]
        
    }

    x(){return this.e[0]}
    y(){return this.e[1]}
    z(){return this.e[2]}
    
    neg(){ return new Vec3(-this.e[0],-this.e[1],-this.e[2])}
    get(i){ return this.e[i]}

    add_eq(v){
        this.e[0] += v.e[0];
        this.e[1] += v.e[1];
        this.e[2] += v.e[2]; 
        return this       
    }

    mul_eq(t){
        this.e[0] *= t
        this.e[1] *= t
        this.e[2] *= t   
        return this     
    }

    div_eq(t){
        this.mul_eq(1.0/t)
        return this
    }

    length_squared(){
        return e[0]*e[0] + e[1]*e[1] + e[2]*e[2];
    }

    length(){
        return Math.sqrt(this.length_squared())
    }


    add(u,v){
        return Vec3(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]);
    }

    sub(u,v){
        return Vec3(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]);
    }

    mul({t=1,u=new Vec3(1,1,1),v}){
        return Vec3(t*u.e[0] * v.e[0], t*u.e[1] * v.e[1], t*u.e[2] * v.e[2]);
    }
 
    div(v,t){
        return this.mul({t:1.0/t,v:v})
    }

    dot(u,v){
        return u.e[0] * v.e[0]
         + u.e[1] * v.e[1]
         + u.e[2] * v.e[2]
    }
    
    cross(u,v){
        return Vec3(u.e[1] * v.e[2] - u.e[2] * v.e[1],
                u.e[2] * v.e[0] - u.e[0] * v.e[2],
                u.e[0] * v.e[1] - u.e[1] * v.e[0])
    }

    unit_vector(v){
        return this.div(v,v.length())
    }
}
// point3 is just an alias for vec3, but useful for geometric clarity in the code.
window.Point3 = Vec3

// Vector Utility Functions
//https://stackoverflow.com/questions/43642729/calling-a-method-from-another-method-in-the-same-class



window.Vec3 = Vec3