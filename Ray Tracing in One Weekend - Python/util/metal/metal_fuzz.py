from util.material import Material
from util.ray import Ray
from util.vec3 import Vec3, reflect, unit_vector, random_unit_vector, dot
class Metal(Material):
    def __init__(self, albedo, fuzz=0.0):
        # metal color
        self.albedo = albedo

        # surface roughness (0 = perfect mirror, 1 = very rough)
        self.fuzz = min(fuzz, 1.0)

    def scatter(self, r_in, rec):

        # ==========================================
        # STEP 1: normalize incoming ray direction
        # ==========================================
        unit_dir = unit_vector(r_in.direction())

        # ==========================================
        # STEP 2: perfect reflection direction
        # R = V - 2(V·N)N
        # ==========================================
        reflected = reflect(unit_dir, rec.normal)

        # ==========================================
        # STEP 3: add fuzz (surface imperfection)
        # ==========================================
        scattered_dir = reflected + self.fuzz * random_unit_vector()

        # ==========================================
        # STEP 4: build scattered ray
        # ==========================================
        scattered = Ray(rec.p, scattered_dir)

        # ==========================================
        # STEP 5: energy attenuation (metal tint)
        # ==========================================
        attenuation = self.albedo

        # ==========================================
        # MUST return exactly 2 values
        # ==========================================
        return scattered, attenuation
    