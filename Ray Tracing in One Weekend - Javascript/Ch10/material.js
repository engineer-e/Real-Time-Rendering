class Material
{
    constructor(){}

    
}


class Lamberiant extends Material{
    constructor(albedo){
        super()
        this.albedo = albedo
    }

     scatter(r_in,  rec, attenuation,  scattered)  {

        var scatter_direction = Vec3.add(rec.N , Vec3.random_unit_vector())

                // Catch degenerate scatter direction
         if(scatter_direction.near_zero()){
             scatter_direction = rec.N;
         }

        scattered(new Ray(rec.p, scatter_direction));
        attenuation(this.albedo);
        
        return false;
    }


}

class Metal extends Material{
    constructor(albedo){
        super()
        this.albedo = albedo
    }

     scatter(r_in,  rec, attenuation,  scattered)  {

        var reflected = Vec3.reflect(r_in.direction(),rec.N)
        scattered(new Ray(rec.p, reflected));
        attenuation(this.albedo);
              
        return true;
    }


}


window.Material = Material
window.Lamberiant = Lamberiant
window.Metal = Metal