import random

from util.week1.vec3 import random_unit_vector
from util.week2.ray import Ray
from util.week1.material import Material


class Lambertian(Material):

    def __init__(self, albedo):

        # ==========================================
        # Surface color
        # ==========================================
        self.albedo = albedo

    def scatter(self, r_in, rec):

        # ==========================================
        # STEP 1:
        # Diffuse random bounce
        #
        # Formula:
        #
        # D = N + random_unit_vector()
        # ==========================================
        scatter_direction = rec.normal + random_unit_vector()

        # ==========================================
        # STEP 2:
        # Degenerate fix
        #
        # If vector becomes zero
        # ==========================================
        if scatter_direction.near_zero():
            scatter_direction = rec.normal

        # ==========================================
        # STEP 3:
        # Create scattered ray
        #
        # OLD:
        # Ray(rec.p, scatter_direction)
        #
        # NEW:
        # Preserve incoming time
        #
        # t_out = t_in
        # ==========================================
        scattered = Ray(
            rec.p,
            scatter_direction,
            r_in.time()
        )

        # ==========================================
        # STEP 4:
        # Color attenuation
        # ==========================================
        attenuation = self.albedo

        return scattered, attenuation