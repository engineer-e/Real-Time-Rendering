
import math
import random

from util.week1.vec3 import (
    Vec3,
    unit_vector,
    reflect,
    refract,
    dot
)

from util.week2.ray import Ray


class Dielectric:

    def __init__(self, refraction_index):

        self.refraction_index = refraction_index

    # ==========================================
    # Schlick approximation
    # ==========================================
    def reflectance(self, cosine, ref_idx):

        r0 = (1 - ref_idx) / (1 + ref_idx)
        r0 = r0 * r0

        return r0 + (
            1 - r0
        ) * pow(
            (1 - cosine),
            5
        )

    def scatter(self, r_in, rec):

        # ==========================================
        # STEP 1:
        # Glass absorbs nothing
        # ==========================================
        attenuation = Vec3(
            1.0,
            1.0,
            1.0
        )

        # ==========================================
        # STEP 2:
        # Refraction ratio
        # ==========================================
        if rec.front_face:
            ri = 1.0 / self.refraction_index
        else:
            ri = self.refraction_index

        # ==========================================
        # STEP 3:
        # Normalize direction
        # ==========================================
        unit_dir = unit_vector(
            r_in.direction()
        )

        # ==========================================
        # STEP 4:
        # cos(theta)
        # ==========================================
        cos_theta = min(
            dot(-unit_dir, rec.normal),
            1.0
        )

        sin_theta = math.sqrt(
            1.0 - cos_theta * cos_theta
        )

        # ==========================================
        # STEP 5:
        # Total internal reflection
        # ==========================================
        cannot_refract = (
            ri * sin_theta > 1.0
        )

        # ==========================================
        # STEP 6:
        # Choose reflect or refract
        # ==========================================
        if (
            cannot_refract
            or random.random()
            < self.reflectance(cos_theta, ri)
        ):

            direction = reflect(
                unit_dir,
                rec.normal
            )

        else:

            direction = refract(
                unit_dir,
                rec.normal,
                ri
            )

        # ==========================================
        # STEP 7:
        # Preserve time
        #
        # NEW:
        # r_in.time()
        # ==========================================
        scattered = Ray(
            rec.p,
            direction,
            r_in.time()
        )

        return scattered, attenuation