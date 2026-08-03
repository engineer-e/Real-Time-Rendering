class ConstantMedium extends Hittable {

    constructor(boundary, density, textureOrColor) {

        super();

        this.boundary = boundary;

        this.neg_inv_density = -1 / density;

        this.phase_function =
            new Isotropic(textureOrColor);
    }



    bounding_box() {

        return this.boundary.bounding_box();

    }



    hit(r, ray_t, hit_record) {

        let rec1 = null;
        let rec2 = null;



        // First boundary hit
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



        // Second boundary hit
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




        let t1 = Math.max(
            rec1.t,
            ray_t.min
        );


        let t2 = Math.min(
            rec2.t,
            ray_t.max
        );



        if (t1 >= t2)
            return false;



        if (t1 < 0)
            t1 = 0;




        let ray_length =
            r.direction().length();



        let distance_inside_boundary =
            (t2 - t1) * ray_length;



        let hit_distance =
            this.neg_inv_density *
            Math.log(
                Math.max(Math.random(), 1e-12)
            );



        if (hit_distance > distance_inside_boundary)
            return false;



        let rec = new HitRecord();



        rec.t =
            t1 +
            hit_distance / ray_length;


        rec.p =
            r.at(rec.t);



        // Required for volume material
        rec.u = 0;
        rec.v = 0;



        // Arbitrary normal
        rec.N =
            new Vec3(1, 0, 0);



        rec.front_face = true;



        // IMPORTANT: use your HitRecord name
        rec.material =
            this.phase_function;



        hit_record(rec);


        return true;
    }
}


window.ConstantMedium = ConstantMedium;