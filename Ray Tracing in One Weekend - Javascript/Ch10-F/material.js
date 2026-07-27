class Material
{
    constructor(){}

    
}


class Lamberiant extends Material{
    constructor(albedo){
        super()
        this.albedo = albedo
    }

     scatter(r_in,  rec, attenuation,  scattered, isScatter)  {

        var scatter_direction = Vec3.add(rec.N , Vec3.random_unit_vector())

                // Catch degenerate scatter direction
         if(scatter_direction.near_zero()){
             scatter_direction = rec.N;
         }

        scattered(new Ray(rec.p, scatter_direction));
        attenuation(this.albedo);
        isScatter(false)
    }


}

class Metal extends Material{
    constructor(albedo,fuzz){
        super()
        this.albedo = albedo
        this.fuzz = fuzz
    }

     scatter(r_in,  rec, attenuation,  scattered,isScatter)  {

        var reflected = Vec3.reflect(r_in.direction(),rec.N)
        reflected = Vec3.add(Vec3.unit_vector(reflected) , Vec3.mul({t:this.fuzz , v:Vec3.random_unit_vector()}));
        var scattering = new Ray(rec.p, reflected)
        scattered(scattering);
        attenuation(this.albedo);
        isScatter(Vec3.dot(scattering.direction(), rec.N) > 0)

    }


}


window.Material = Material
window.Lamberiant = Lamberiant
window.Metal = Metal