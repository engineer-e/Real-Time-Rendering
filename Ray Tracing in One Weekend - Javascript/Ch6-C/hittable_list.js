class HittableList extends Hittable{
    constructor(object){
        super()
        this.objects = object
    }

    clear(){ this.objects = [] }

    add(object){ this.objects.append(object)}

    hit(r, ray_tmin, ray_tmax, hit_record){
       var temp_rec = new HitRecord()
       var hit_anything = false 
       var closest_so_far = Number.MAX_VALUE

       for(var object in this.objects){
          if(object.hit(r, ray_tmin, closest_so_far, (rec)=>{temp_rec=rec})){
            hit_anything = true;
            closest_so_far = temp_rec.t;
            rec = temp_rec;
            hit_record(rec)
          }
       }

       return hit_anything

    }


}