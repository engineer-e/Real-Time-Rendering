class HitRecord{
    constructor(){
        this.p = new Point3(0.0,0.0,0.0)
        this.N = new Vec3(0.0,0.0,0.0) 
        this.t = 0.0
        
    }

    set_face_normal(r,outward_normal){
        // Sets the hit record normal vector.
        // NOTE: the parameter `outward_normal` is assumed to have unit length.

        this.front_face = Vec3.dot(r.direction(), outward_normal) < 0;
        this.N = this.front_face ? outward_normal : -outward_normal;
    }
}

class Hittable{
    constructor(){}

    hit(r,ray_tmin,ray_tmax,hit_record){}
}

window.HitRecord = HitRecord
window.Hittable = Hittable