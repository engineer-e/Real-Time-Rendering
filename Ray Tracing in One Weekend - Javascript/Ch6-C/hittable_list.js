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
          if(this.objects[object].hit(r, ray_tmin, closest_so_far, (rec)=>{temp_rec=rec})){
            hit_anything = true;
            closest_so_far = temp_rec.t;
            hit_record(temp_rec)
          }
       }

       return hit_anything

    }


}

window.HittableList = HittableList