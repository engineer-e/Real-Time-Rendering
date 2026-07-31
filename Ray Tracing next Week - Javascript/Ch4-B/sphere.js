class Sphere extends Hittable{
   
  
   constructor({
  center1,
  center2,
  radius,
  material
}) {
  super();

   var rVec = new Vec3(radius, radius, radius)


  if(center2==null){

    this.center = new Ray({origin:center1,direction:Vec3.sub(center1, new Vec3(0,0,0))});
    this.bbox = new AABB({a:Vec3.sub(center1,rVec),b:Vec3.add(center1,rVec)})
    
  }
  else{
    this.center = new Ray({origin:center1,direction:Vec3.sub(center2, center1)});
    var box1 = new AABB({a:Vec3.sub(this.center.at(0), rVec),b:Vec3.add(this.center.at(0), rVec)})
    var box2 = new AABB({a:Vec3.sub(this.center.at(1), rVec),b:Vec3.add(this.center.at(1), rVec)})
    this.bbox = new AABB({box0:box1,box1:box2})
  }

  this.radius = Math.max(0, radius);
  this.material = material;
} 


   bounding_box(){
    return this.bbox
   }


   hit(r,ray_t,hit_record){
    //super(r,ray_tmin,ray_tmax,rec)

       // var current_center = this.center.at(r.time())
        var current_center = this.center.origin()

        var oc = Vec3.sub(current_center,r.origin())
        //console.log(r.direction())
        var a = r.direction().length_squared();
        var h = Vec3.dot(r.direction(), oc);
        var c = oc.length_squared() - this.radius*this.radius;
        var discriminant = h*h - a*c;
    
        if (discriminant < 0) {
            return false;
        } 
        
        var sqrtd = Math.sqrt(discriminant);


        var root = (h - sqrtd) / a;
      
        /*
        if (root <= ray_tmin || ray_tmax <= root) {
            root = (h + sqrtd) / a;
            if (root <= ray_tmin || ray_tmax <= root)
                return false;
        }
            */

        if (!ray_t.surrounds(root)) {
            root = (h + sqrtd) / a;
            if (!ray_t.surrounds(root))
                return false;
        }



        var rec = new HitRecord()
        rec.t = root 
        rec.p = r.at(rec.t);
        var outward_normal = Vec3.div(Vec3.sub(rec.p,current_center),this.radius)
        rec.set_face_normal(r,outward_normal)
        
        //get_sphere_uv(outward_normal,rec.u,rec.v)

        rec.material = this.material
        hit_record(rec)

        return true
   }

}