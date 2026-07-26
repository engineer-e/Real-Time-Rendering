class Sphere extends Hittable{
   
    constructor(center, radius){
    super()
    this.center = center
    this.radius = Math.max(0,radius)
   }

   hit(r,ray_tmin,ray_tmax,hit_record){
    //super(r,ray_tmin,ray_tmax,rec)
        var oc = Vec3.sub(center,r.origin())
        var a = r.direction().length_squared();
        var h = Vec3.dot(r.direction(), oc);
        var c = oc.length_squared() - radius*radius;
        var discriminant = h*h - a*c;
    
        if (discriminant < 0) {
            return false;
        } 
        
        var root = (h - Math.sqrt(discriminant)) / a;
        
        if (root <= ray_tmin || ray_tmax <= root) {
            root = (h + sqrtd) / a;
            if (root <= ray_tmin || ray_tmax <= root)
                return false;
        }

        var rec = new HitRecord()
        rec.t = root 
        rec.p = r.at(rec.t);
        var outward_normal = Vec3.div(Vec3.sub(rec.p,center),radius)
        rec.set_face_normal(r,outward_normal)
        hit_record(rec)

        return true
   }

}