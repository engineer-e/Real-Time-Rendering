class Material {
    constructor(){}

    emitted(u,v,p){
        return new Vec3(0,0,0);
    }

    scatter(r_in, rec, attenuation, scattered, isScatter){
        return false;
    }
}


class Lamberiant extends Material{
    constructor({albedo,tex}){
        super()
        this.albedo = albedo
        this.tex = tex
    }

     scatter(r_in,  rec, attenuation,  scattered, isScatter)  {

        var scatter_direction = Vec3.add(rec.N , Vec3.random_unit_vector())

                // Catch degenerate scatter direction
         if(scatter_direction.near_zero()){
             scatter_direction = rec.N;
         }

        scattered(new Ray({origin:rec.p, direction:scatter_direction, time:r_in.time()}));
            if(this.tex!=null)
          {
            //console.log(rec)
          attenuation(this.tex.value(rec.u, rec.v,rec.p));
          }
        else 
          {
  attenuation(this.albedo)
       
          } 
        isScatter(true)
        return true;
    }


}

// class Metal extends Material{
//     constructor(albedo,fuzz){
//         super()
//         this.albedo = albedo
//         this.fuzz = fuzz
//     }

//     //  scatter(r_in,  rec, attenuation,  scattered,isScatter)  {

//     //     var reflected = Vec3.reflect(r_in.direction(),rec.N)
//     //     reflected = Vec3.add(Vec3.unit_vector(reflected) , Vec3.mul({t:this.fuzz , v:Vec3.random_unit_vector()}));
//     //     var scattering = new Ray({origin:rec.p,direction:reflected,time:r_in.time()})
//     //     scattered(scattering);
//     //     attenuation(this.albedo);
//     //     isScatter(Vec3.dot(scattering.direction(), rec.N) > 0)

//     // }

//     scatter(r_in, rec, attenuation, scattered, isScatter) {

//     var reflected = Vec3.reflect(r_in.direction(), rec.N);

//     reflected = Vec3.add(
//         Vec3.unit_vector(reflected),
//         Vec3.mul({
//             t:this.fuzz,
//             v:Vec3.random_unit_vector()
//         })
//     );

//     var scattering = new Ray({
//         origin:rec.p,
//         direction:reflected,
//         time:r_in.time()
//     });

//     scattered(scattering);
//     attenuation(this.albedo);

//     var ok = Vec3.dot(scattering.direction(), rec.N) > 0;

//     isScatter(ok);

//     return ok;
// }

// }


class Metal extends Material {

    constructor(albedo, fuzz) {
        super();

        this.albedo = albedo;
        this.fuzz = Math.min(fuzz, 1.0);
    }


    scatter(r_in, rec, attenuation, scattered, isScatter) {

        // Reflect incoming ray around surface normal
        var reflected = Vec3.reflect(
            Vec3.unit_vector(r_in.direction()),
            rec.N
        );


        // Add fuzziness
        reflected = Vec3.add(
            reflected,
            Vec3.mul({
                t: this.fuzz,
                v: Vec3.random_unit_vector()
            })
        );


        var scattering = new Ray({
            origin: rec.p,
            direction: reflected,
            time: r_in.time()
        });


        // Only scatter if ray goes above the surface
        var ok = Vec3.dot(
            scattering.direction(),
            rec.N
        ) > 0;


        attenuation(this.albedo);
        scattered(scattering);
        isScatter(ok);


        return ok;
    }
}


class Dielectric extends Material{
     constructor(refraction_index){
        super()
        this.refraction_index = refraction_index
    }


    reflectance( cosine,  refraction_index) {
        // Use Schlick's approximation for reflectance.
        var r0 = (1 - refraction_index) / (1 + refraction_index);
        r0 = r0*r0;
        return r0 + (1-r0)*Math.pow((1 - cosine),5);
    }

    //  scatter(r_in,  rec, attenuation,  scattered,isScatter)  {

    //     attenuation(new Vec3(1.0,1.0,1.0));
    //     var ri = rec.front_face ? (1.0/this.refraction_index) : this.refraction_index;
        
    //     var unit_direction = Vec3.unit_vector(r_in.direction());

    //     var cos_theta = Math.min(Vec3.dot(unit_direction.neg(), rec.N), 1.0);
    //     var sin_theta = Math.sqrt(1.0 - cos_theta*cos_theta);



    //     var cannot_refract = ri * sin_theta > 1.0;
    //     var direction_dielectric;

    //     if (cannot_refract || (this.reflectance(cos_theta,ri)> Vec3.random_double()))
    //         direction_dielectric = Vec3.reflect(unit_direction, rec.N);
    //     else
    //         direction_dielectric = Vec3.refract(unit_direction, rec.N, ri);

    //     var scattering = new Ray({origin:rec.p, direction:direction_dielectric,time:r_in.time()})
    //     scattered(scattering);
    //     isScatter(true)

    // }

    scatter(r_in, rec, attenuation, scattered, isScatter) {

    attenuation(new Vec3(1.0, 1.0, 1.0));

    var ri = rec.front_face
        ? (1.0 / this.refraction_index)
        : this.refraction_index;


    var unit_direction = Vec3.unit_vector(r_in.direction());

    var cos_theta = Math.min(
        Vec3.dot(unit_direction.neg(), rec.N),
        1.0
    );

    var sin_theta = Math.sqrt(1.0 - cos_theta * cos_theta);


    var cannot_refract = ri * sin_theta > 1.0;


    var direction;


    if (cannot_refract ||
        this.reflectance(cos_theta, ri) > Vec3.random_double()) {

        direction = Vec3.reflect(
            unit_direction,
            rec.N
        );

    } else {

        direction = Vec3.refract(
            unit_direction,
            rec.N,
            ri
        );
    }


    scattered(
        new Ray({
            origin: rec.p,
            direction: direction,
            time: r_in.time()
        })
    );


    isScatter(true);

    return true;
}

    
}

class DiffuseLight extends Material{
    constructor({tex,emit}){
        super()
        if(tex != null){
            this.tex = tex 
        }else{
            this.tex = new SolidColor(emit)
        }
        
    }

    emitted(u,v,p){
        return this.tex.value(u,v,p)
    }

}

class Isotropic extends Material {

    constructor(albedoOrTexture) {
        super();

        if (
            albedoOrTexture &&
            typeof albedoOrTexture.value === "function"
        ) {
            this.tex = albedoOrTexture;
        } 
        else {
            this.tex = new SolidColor(albedoOrTexture);
        }
    }


    scatter(r_in, rec, attenuation, scattered, isScatter) {

        scattered(
            new Ray({
                origin: rec.p,
                direction: Vec3.random_unit_vector(),
                time: r_in.time()
            })
        );


        attenuation(
            this.tex.value(
                rec.u,
                rec.v,
                rec.p
            )
        );


        isScatter(true);

        return true;
    }
}


window.Isotropic = Isotropic;
window.Material = Material
window.Lamberiant = Lamberiant
window.Metal = Metal
window.Dielectric = Dielectric
window.DiffuseLight = DiffuseLight