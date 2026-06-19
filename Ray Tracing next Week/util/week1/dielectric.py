
import math
import random
from util.week1.vec3 import Vec3,unit_vector,reflect,refract,dot
from util.week1.ray import Ray

class Dielectric:
    def __init__(self, refraction_index):
        # η (eta): refractive index of material (glass ~1.5)
        self.refraction_index = refraction_index

    # ==========================================
    # SCHLICK APPROXIMATION (Fresnel reflectance)
    # ==========================================
    def reflectance(self, cosine, ref_idx):

        # STEP 1: compute base reflectivity R0
        # CHANGE: replaces full Fresnel equations
        r0 = (1 - ref_idx) / (1 + ref_idx)
        r0 = r0 * r0

        # STEP 2: angle-based adjustment
        # (1 - cosθ)^5 makes grazing angles highly reflective
        return r0 + (1 - r0) * pow((1 - cosine), 5)

    def scatter(self, r_in, rec):

        # ==========================================
        # STEP 1: no absorption in glass
        # ==========================================
        attenuation = Vec3(1.0, 1.0, 1.0)

        # ==========================================
        # STEP 2: compute refraction ratio
        # CHANGE: handles inside/outside medium
        # ==========================================
        if rec.front_face:
            ri = 1.0 / self.refraction_index
        else:
            ri = self.refraction_index

        # ==========================================
        # STEP 3: normalize ray direction
        # ==========================================
        unit_dir = unit_vector(r_in.direction())

        # ==========================================
        # STEP 4: compute cos(theta)
        # ==========================================
        cos_theta = min(dot(-unit_dir, rec.normal), 1.0)

        # ==========================================
        # STEP 5: compute sin(theta)
        # ==========================================
        sin_theta = math.sqrt(1.0 - cos_theta * cos_theta)

        # ==========================================
        # STEP 6: check Total Internal Reflection
        # CHANGE: added realism condition
        # ==========================================
        cannot_refract = ri * sin_theta > 1.0

        # ==========================================
        # STEP 7: Schlick probability
        # CHANGE: NEW compared to previous version
        # ==========================================
        reflect_prob = self.reflectance(cos_theta, ri)

        # ==========================================
        # STEP 8: probabilistic decision
        # ==========================================
        if cannot_refract or random.random() < reflect_prob:
            # REFLECTION (mirror behavior)
            direction = reflect(unit_dir, rec.normal)

        else:
            # REFRACTION (Snell's law)
            direction = refract(unit_dir, rec.normal, ri)

        # ==========================================
        # STEP 9: final ray
        # ==========================================
        scattered = Ray(rec.p, direction)

        return scattered, attenuation