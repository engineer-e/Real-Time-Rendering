import math
import random
from util.week1.vec3 import Vec3,unit_vector,reflect,random_unit_vector
from util.week1.ray import Ray
from util.week1.material import Material

class Lambertian(Material):

    def __init__(self, albedo):

        # ==========================================
        # MATERIAL COLOR RESPONSE
        # ==========================================
        # albedo = how much light is preserved
        self.albedo = albedo

    def scatter(self, r_in, rec):

        # ==========================================
        # DIFFUSE SCATTERING MODEL
        #
        # FORMULA:
        # S = N + random_unit_vector()
        # ==========================================
        scatter_direction = rec.normal + random_unit_vector()

        # ==========================================
        # ZERO VECTOR FIX
        #
        # If vector collapses → fallback to normal
        # ==========================================
        if scatter_direction.near_zero():
            scatter_direction = rec.normal

        # ==========================================
        # NEW RAY FROM HIT POINT
        # ==========================================
        scattered = Ray(rec.p, scatter_direction)

        # ==========================================
        # ENERGY LOSS
        #
        # FORMULA:
        # C_out = albedo * C_in
        # ==========================================
        attenuation = self.albedo

        # ==========================================
        # MUST RETURN EXACTLY 2 VALUES
        # ==========================================
        return scattered, attenuation