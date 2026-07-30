class HitRecord{
    constructor(){
        this.p = new Point3(0.0,0.0,0.0)
        this.N = new Vec3(0.0,0.0,0.0) 
        this.t = 0.0
        this.material = new Material()
        
        
    }

    set_face_normal(r,outward_normal){
        // Sets the hit record normal vector.
        // NOTE: the parameter `outward_normal` is assumed to have unit length.

        this.front_face = Vec3.dot(r.direction(), outward_normal) < 0;
        this.N = this.front_face ? outward_normal : outward_normal.neg();
    }
}

class Hittable{
    constructor(){}

    hit(r,ray_t,hit_record){}
}

window.HitRecord = HitRecord
window.Hittable = Hittable