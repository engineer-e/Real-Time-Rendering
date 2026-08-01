class HittableList extends Hittable {

    constructor(objects = []) {
        super();

        this.objects = objects;
        this.bbox = null;

        for (const object of this.objects) {
            if (this.bbox === null)
                this.bbox = object.bounding_box();
            else
                this.bbox = new AABB({
                    box0: this.bbox,
                    box1: object.bounding_box()
                });
        }
    }

    clear() {
        this.objects = [];
        this.bbox = null;
    }

    add(object) {
        this.objects.push(object);

        if (this.bbox === null)
            this.bbox = object.bounding_box();
        else
            this.bbox = new AABB({
                box0: this.bbox,
                box1: object.bounding_box()
            });
    }

    hit(r, ray_t, hit_record) {

        let temp_rec = new HitRecord();
        let hit_anything = false;
        let closest_so_far = ray_t.max;

        for (const object of this.objects) {

            if (object.hit(
                r,
                new Interval({ min: ray_t.min, max: closest_so_far }),
                (rec)=>{
                temp_rec = rec;
            }
            )) {

                hit_anything = true;
                closest_so_far = temp_rec.t;
                hit_record(temp_rec);
            }
        }

        return hit_anything;
    }

    bounding_box() {
        return this.bbox;
    }
}

window.HittableList = HittableList;