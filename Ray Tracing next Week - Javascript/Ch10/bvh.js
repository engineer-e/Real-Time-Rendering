class BVH_Node extends Hittable{
   constructor(objects, start = 0, end = objects.length) {
        super();
        this.build(objects, start, end);
    }

    build(objects, start, end) {



        
        let bbox = new AABB({
    x:new Interval({
        min:Number.MAX_VALUE,
        max:-Number.MAX_VALUE
    }),
    y:new Interval({
        min:Number.MAX_VALUE,
        max:-Number.MAX_VALUE
    }),
    z:new Interval({
        min:Number.MAX_VALUE,
        max:-Number.MAX_VALUE
    })
});


for(let i=start;i<end;i++){

    bbox = new AABB({
        box0:bbox,
        box1:objects[i].bounding_box()
    });

}


const axis = bbox.longest_axis();

        
        //const axis = Vec3.random_int(0, 2);

        
        const object_span = end - start;

        if (object_span === 1) {

            this.left = objects[start];
            this.right = objects[start];

        } else if (object_span === 2) {

            if (this.box_compare(objects[start], objects[start + 1], axis) < 0) {
                this.left = objects[start];
                this.right = objects[start + 1];
            } 
           else {
               this.left = objects[start + 1];
               this.right = objects[start];
           }

        } else {

            const spanObjects = objects.slice(start, end);

            spanObjects.sort((a, b) => this.box_compare(a, b, axis));

            for (let i = 0; i < spanObjects.length; i++) {
                objects[start + i] = spanObjects[i];
            }

            const mid = start + Math.floor(object_span / 2);

            this.left = new BVH_Node(objects, start, mid);
            this.right = new BVH_Node(objects, mid, end);
        }

        this.bbox = new AABB({
            box0: this.left.bounding_box(),
            box1: this.right.bounding_box()
        });
    }

    // hit(r, ray_t, rec) {

    //     if (!this.bbox.hit(r, ray_t))
    //         return false;

    //     const hit_left = this.left.hit(r, ray_t, rec);

    //     const hit_right = this.right.hit(
    //         r,
    //         new Interval({
    //             min: ray_t.min,
    //             max: hit_left ? rec.t : ray_t.max
    //         }),
    //         rec
    //     );

    //     return hit_left || hit_right;
    // }


   hit(r, ray_t, hit_record) {

    if (!this.bbox.hit(r, ray_t)) {
        return false;
    }

    let temp_left = new HitRecord();
    let temp_right = new HitRecord();

    let hit_left = this.left.hit(
        r,
        ray_t,
        (rec) => {
            temp_left = rec;
        }
    );

    let hit_right = false;

    if (hit_left) {
        hit_right = this.right.hit(
            r,
            new Interval({
                min: ray_t.min,
                max: temp_left.t
            }),
            (rec) => {
                temp_right = rec;
            }
        );
    } else {
        hit_right = this.right.hit(
            r,
            ray_t,
            (rec) => {
                temp_right = rec;
            }
        );
    }


    if (hit_left && hit_right) {
        if (temp_left.t < temp_right.t) {
            hit_record(temp_left);
        } else {
            hit_record(temp_right);
        }
        return true;
    }

    if (hit_left) {
        hit_record(temp_left);
        return true;
    }

    if (hit_right) {
        hit_record(temp_right);
        return true;
    }

    return false;
}


    bounding_box() {
        return this.bbox;
    }

    box_compare(a, b, axis) {

        const aInterval = a.bounding_box().axis_interval(axis);
        const bInterval = b.bounding_box().axis_interval(axis);

        return aInterval.min - bInterval.min;
    }

box_x_compare(a,b){return this.box_compare(a,b,0)}
box_y_compare(a,b){return this.box_compare(a,b,1)}
box_z_compare(a,b){return this.box_compare(a,b,2)}

}

window.BVH_Node = BVH_Node