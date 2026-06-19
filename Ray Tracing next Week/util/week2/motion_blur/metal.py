from util.week1.vec3 import (
    unit_vector,
    reflect,
    random_unit_vector
)
from util.week2.ray import Ray
from util.week1.material import Material


class Metal(Material):

    def __init__(self, albedo, fuzz=0.0):

        self.albedo = albedo
        self.fuzz = min(fuzz, 1.0)

    def scatter(self, r_in, rec):

        # ==========================================
        # STEP 1:
        # Normalize incoming ray
        # ==========================================
        unit_dir = unit_vector(
            r_in.direction()
        )

        # ==========================================
        # STEP 2:
        # Reflection formula
        #
        # R = V - 2(V·N)N
        # ==========================================
        reflected = reflect(
            unit_dir,
            rec.normal
        )

        # ==========================================
        # STEP 3:
        # Add fuzz
        # ==========================================
        scattered_dir = (
            reflected
            + self.fuzz * random_unit_vector()
        )

        # ==========================================
        # STEP 4:
        # Preserve time
        #
        # NEW:
        # r_in.time()
        # ==========================================
        scattered = Ray(
            rec.p,
            scattered_dir,
            r_in.time()
        )

        attenuation = self.albedo

        return scattered, attenuation