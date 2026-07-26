class HitRecord{
    constructor(p,N,t){
        this.p = p
        this.N = N 
        this.t = t
    }
}

class Hittable{
    hit(r,ray_tmin,ray_tmax,rec){}
}

window.HitRecord = HitRecord
window.Hittable = Hittable