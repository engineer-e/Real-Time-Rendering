class Quad{
    constructor(Q, u, v, mat){
      this.Q = Q 
      this.u = u 
      this.v = v
      this.mat = mat 

      var n = Vec3.cross(u,v)
      this.N = Vec3.unit_vector(n)
      this.D = Vec3.dot(this.N, this.Q)
      this.w = Vec3.mul({t:1/Vec3.dot(n,n),v:n})
    
      this.set_bounding_box()

    }

    set_bounding_box(){
        var bbox_diagonal1 = new AABB({a:this.Q,b:Vec3.add(this.Q,Vec3.add(this.u,this.v))})
        var bbox_diagonal2 = new AABB({a:Vec3.add(this.Q,this.u),b:Vec3.add(this.Q,this.v)})
        this.bbox = new AABB({box0:bbox_diagonal1,box1:bbox_diagonal2})
    }

    bounding_box(){ return this.bbox }

    is_interior(a,b,rec){
        var unit_interval = new Interval({min:0,max:1})

        if(!unit_interval.contains(a) || !unit_interval.contains(b))
            return false 

        rec.u = a 
        rec.v = b 
        return true 
    }

    hit(r, ray_t, hit_record){

        var denom = Vec3.dot(this.N,r.direction())

        // No hit if the ray is parallel to the plane.
        if(Math.abs(denom) < 1e-8) return false 

        var t = (this.D - Vec3.dot(this.N, r.origin()))/denom 

        if(!ray_t.contains(t)){
            return false 
        }
        
        // Determine if the hit point lies within the planar shape using its plane coordinates.
        var intersection = r.at(t)
        var planar_hitpt_vector = Vec3.sub(intersection,this.Q)
        var alpha = Vec3.dot(this.w, Vec3.cross(planar_hitpt_vector,this.v))
        var beta  = Vec3.dot(this.w, Vec3.cross(this.u, planar_hitpt_vector))

       

        // Ray hits the 2D shape; set the rest of the hit record and return true.
        var rec = new HitRecord()
        if(!this.is_interior(alpha,beta,rec)){
            return false
        }
        rec.t = t 
        rec.p = intersection
        rec.material = this.mat 
        rec.set_face_normal(r,this.N)
        hit_record(rec)


        return true
    }
}

window.Quad = Quad
