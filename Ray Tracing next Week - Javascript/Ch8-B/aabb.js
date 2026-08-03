class AABB{
    
    // constructor({x,y,z,a,b,box0,box1}){


    //     if((x!=null)&&(y!=null)&&(z!=null)){
    //         this.x = x 
    //         this.y = y 
    //         this.z = z 
    //     }

    //     if((a!=null)&&(b!=null)){
    //         this.x = (a.x <= b.x) ? new Interval({min:a.x,max:b.x}):new Interval({min:b.x,max:a.x})
    //         this.y = (a.y <= b.y) ? new Interval({min:a.y,max:b.y}):new Interval({min:b.y,max:a.y})
    //         this.z = (a.z <= b.z) ? new Interval({min:a.z,max:b.z}):new Interval({min:b.z,max:a.z})
    //     }

    //     if((box0!=null)&&(box1!=null)){
    //         this.x = new Interval({a:box0.x,b:box1.x})
    //         this.y = new Interval({a:box0.y,b:box1.y})
    //         this.z = new Interval({a:box0.z,b:box1.z})
    //     }

    // }


    constructor({x,y,z,a,b,box0,box1}){


    if(x && y && z){
        this.x=x;
        this.y=y;
        this.z=z;
    }


    if(a && b){

        this.x = new Interval({
            min:Math.min(a.x,b.x),
            max:Math.max(a.x,b.x)
        });

        this.y = new Interval({
            min:Math.min(a.y,b.y),
            max:Math.max(a.y,b.y)
        });

        this.z = new Interval({
            min:Math.min(a.z,b.z),
            max:Math.max(a.z,b.z)
        });

        this.pad_to_minimums()

    }


    if(box0 && box1){

        this.x = new Interval({
            min:Math.min(box0.x.min,box1.x.min),
            max:Math.max(box0.x.max,box1.x.max)
        });


        this.y = new Interval({
            min:Math.min(box0.y.min,box1.y.min),
            max:Math.max(box0.y.max,box1.y.max)
        });


        this.z = new Interval({
            min:Math.min(box0.z.min,box1.z.min),
            max:Math.max(box0.z.max,box1.z.max)
        });
    }

}

    axis_interval(n){
        if(n==1) return this.y 
        if(n==2) return this.z 
        return this.x
    }

    // hit(r,ray_t){
    //     var ray_orig = r.origin() 
    //     var ray_dir  = r.direction()

    //     for(var axis = 0; axis < 3; axis++){
    //         var ax = this.axis_interval(axis)
    //         var adinv = 1.0 / ray_dir.e[axis]

    //         var t0 = (ax.min - ray_orig.e[axis]) * adinv 
    //         var t1 = (ax.max - ray_orig.e[axis]) * adinv 

    //         if(t0<t1){
    //             if(t0 > ray_t.min) ray_t.min = t0 
    //             if(t1 < ray_t.max) ray_t.max = t1      
    //         }else{
    //             if(t1 > ray_t.min) ray_t.min = t1 
    //             if(t0 < ray_t.max) ray_t.max = t0  
    //         }
        
    //     if(ray_t.max <= ray_t.min)
    //         return false     

    //     }

    //     return true 
    // }

    hit(r, ray_t){

    var ray_orig = r.origin();
    var ray_dir = r.direction();

    let t_min = ray_t.min;
    let t_max = ray_t.max;


    for(let axis = 0; axis < 3; axis++){

        var ax = this.axis_interval(axis);

        var invD = 1.0 / ray_dir.e[axis];

        var t0 = (ax.min - ray_orig.e[axis]) * invD;
        var t1 = (ax.max - ray_orig.e[axis]) * invD;


        if(invD < 0){
            let temp = t0;
            t0 = t1;
            t1 = temp;
        }


        if(t0 > t_min)
            t_min = t0;


        if(t1 < t_max)
            t_max = t1;


        if(t_max <= t_min)
            return false;
    }


    return true;
}

longest_axis(){

    let x_size = this.x.size();
    let y_size = this.y.size();
    let z_size = this.z.size();


    if(x_size > y_size){
        return x_size > z_size ? 0 : 2;
    }
    else{
        return y_size > z_size ? 1 : 2;
    }
}


pad_to_minimums(){
    var delta = 0.0001

    if(this.x.size() < delta) this.x = this.x.expand(delta)
    if(this.y.size() < delta) this.y = this.y.expand(delta)
    if(this.z.size() < delta) this.z = this.z.expand(delta)
        
}


static add({bbox, offset}){
    return new AABB({x:bbox.x+offset.x,y:bbox.y+offset.y,z:bbox.z+offset.z})
}

}



window.AABB = AABB