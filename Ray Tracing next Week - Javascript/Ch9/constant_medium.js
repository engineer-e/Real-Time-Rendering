class ConstantMedium extends Hittable {

    constructor(boundary, density, textureOrColor) {
        super();

        this.boundary = boundary;

        // -1 / density
        this.neg_inv_density = -1 / density;

        // isotropic phase function
        this.phase_function = new Isotropic(textureOrColor);
    }


    bounding_box() {
        return this.boundary.bounding_box();
    }


    hit(r, ray_t, hit_record) {

        let rec1 = null;
        let rec2 = null;


        // Find first intersection with boundary
        if (
            !this.boundary.hit(
                r,
                new Interval({
                    min: -Infinity,
                    max: Infinity
                }),
                (rec) => {
                    rec1 = rec;
                }
            )
        ) {
            return false;
        }



        // Find second intersection with boundary
        if (
            !this.boundary.hit(
                r,
                new Interval({
                    min: rec1.t + 0.0001,
                    max: Infinity
                }),
                (rec) => {
                    rec2 = rec;
                }
            )
        ) {
            return false;
        }



        // Clamp to ray interval

        if (rec1.t < ray_t.min) {
            rec1.t = ray_t.min;
        }


        if (rec2.t > ray_t.max) {
            rec2.t = ray_t.max;
        }



        if (rec1.t >= rec2.t) {
            return false;
        }



        if (rec1.t < 0) {
            rec1.t = 0;
        }



        // Distance travelled inside the medium

        const ray_length = r.direction().length();


        const distance_inside_boundary =
            (rec2.t - rec1.t) * ray_length;



        // Random scattering distance

        const hit_distance =
            this.neg_inv_density *
            Math.log(Math.random());



        if (hit_distance > distance_inside_boundary) {
            return false;
        }



        // Create medium hit record

        let rec = new HitRecord();


        rec.t =
            rec1.t +
            hit_distance / ray_length;


        rec.p = r.at(rec.t);



        // Arbitrary normal for volume hit

        rec.N = new Vec3(1, 0, 0);


        // Volume hits are always considered front face

        rec.front_face = true;



        // Isotropic material

        rec.mat = this.phase_function;


        hit_record(rec);

        return true;
    }
}


window.ConstantMedium = ConstantMedium;