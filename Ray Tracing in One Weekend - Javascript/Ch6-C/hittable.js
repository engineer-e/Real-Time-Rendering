class HitRecord{
    constructor(){
        this.p = new Point3(0.0,0.0,0.0)
        this.N = new Vec3(0.0,0.0,0.0) 
        this.t = 0.0
    }
}

class Hittable{
    constructor(){}

    hit(r,ray_tmin,ray_tmax,hit_record){}
}

window.HitRecord = HitRecord
window.Hittable = Hittable