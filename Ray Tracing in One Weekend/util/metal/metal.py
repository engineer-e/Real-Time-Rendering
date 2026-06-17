from util.material import Material
from util.ray import Ray
from util.vec3 import Vec3, reflect, unit_vector


class Metal(Material):

    def __init__(self, albedo):

        # ==========================================
        # REFLECTIVE COLOR (metal tint)
        # ==========================================
        self.albedo = albedo

    def scatter(self, ray_in, rec):

        # ==========================================
        # SPECULAR REFLECTION
        #
        # FORMULA:
        # R = V - 2(V·N)N
        # ==========================================
        reflected_dir = reflect(
            unit_vector(ray_in.direction()),
            rec.normal
        )

        # ==========================================
        # NEW REFLECTED RAY
        # ==========================================
        scattered = Ray(rec.p, reflected_dir)

        # ==========================================
        # ENERGY ATTENUATION
        # ==========================================
        attenuation = self.albedo

        # ==========================================
        # MUST MATCH CAMERA EXPECTATION
        # ==========================================
        return scattered, attenuation