class Vec3{
    constructor(x,y,z){
        this.e=[x,y,z]
        
    }


    get x() { return this.e[0]; }
    set x(v) { this.e[0] = v; }

    get y() { return this.e[1]; }
    set y(v) { this.e[1] = v; }

    get z() { return this.e[2]; }
    set z(v) { this.e[2] = v; }
    
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
        return this.e[0]*this.e[0] + this.e[1]*this.e[1] + this.e[2]*this.e[2];
    }

    near_zero()  {
        // Return true if the vector is close to zero in all dimensions.
        var s = 1e-8;
        return (Math.abs(this.e[0]) < s) && (Math.abs(this.e[1]) < s) && (Math.abs(this.e[2]) < s);
    }

    length(){
        return Math.sqrt(this.length_squared())
    }


    static add(u,v){
        if (!u || !v) {
         return new Vec3(0,0,0);
    }
        return new Vec3(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]);
    }

    static sub(u,v){
    
        return new Vec3(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]);
    }

    static mul({t=1,u = new Vec3(1,1,1),v}){
        return new Vec3(t*u.e[0] * v.e[0], t*u.y * v.e[1], t*u.z * v.e[2]);
    }
 
    static div(v,t){
        return this.mul({t:1.0/t,v:v})
    }

    static dot(u,v){
        return u.e[0] * v.e[0]
         + u.e[1] * v.e[1]
         + u.e[2] * v.e[2]
    }
    
    static cross(u,v){
        return new Vec3(u.e[1] * v.e[2] - u.e[2] * v.e[1],
                u.e[2] * v.e[0] - u.e[0] * v.e[2],
                u.e[0] * v.e[1] - u.e[1] * v.e[0])
    }

    static unit_vector(v){
        return this.div(v,v.length())
    }

    static random_double(min, max) {
    return min + (max - min) * Math.random();
    }

    static random(){
        return new Vec3(Math.random(),Math.random(),Math.random())
    }

    static random(min, max){
        return new Vec3(this.random_double(min,max),this.random_double(min,max),this.random_double(min,max))
    }


    static random_unit_vector(){
        while(true){
            var p = this.random(-1.0,1.0)
            var lensq = p.length_squared()
            if((1e-160 < lensq) && (lensq <= 1 ))
                return Vec3.div(p, Math.sqrt(lensq));
        }
    }

    static random_on_hemisphere(N){
        var on_unit_sphere = this.random_unit_vector()
        return (this.dot(on_unit_sphere,N)>0.0) ? on_unit_sphere : on_unit_sphere.neg()
    }

    static reflect( v, n) {
        //    return v - 2*dot(v,n)*n;
        var a = this.mul({t:2*Vec3.dot(v,n),v:n})
        return Vec3.sub(v , a);
    }

    static refract(uv, n,etai_over_etat ){
        var cos_theta = Math.min(this.dot(uv.neg(),n),1.0)
        var r_out_perp = this.mul({t:etai_over_etat  ,v: this.add(uv , this.mul({t:cos_theta,v:n}))})
        var r_out_parallel = this.mul({t:-Math.sqrt(Math.abs(1.0-r_out_perp.length_squared())) , v:n})
        return this.add(r_out_perp,r_out_parallel)
    }

    static degrees_to_radians = degrees => degrees * (Math.PI / 180);
}
// point3 is just an alias for vec3, but useful for geometric clarity in the code.
window.Point3 = Vec3

// Vector Utility Functions
//https://stackoverflow.com/questions/43642729/calling-a-method-from-another-method-in-the-same-class



window.Vec3 = Vec3



