import math
from util.hittable import Hittable
from util.vec3 import dot


class Sphere(Hittable):

    def __init__(self, center, radius):
        self.center = center
        self.radius = max(0.0, radius)

    def hit(self, ray, tmin, tmax, rec):

        # -----------------------------
        # VECTOR FROM RAY ORIGIN TO SPHERE CENTER
        # -----------------------------
        oc = self.center - ray.origin()

        # -----------------------------
        # QUADRATIC COEFFICIENTS
        # -----------------------------
        a = ray.direction().length_squared()
        h = dot(ray.direction(), oc)
        c = dot(oc, oc) - self.radius * self.radius

        discriminant = h * h - a * c

        # No real roots → no hit
        if discriminant < 0:
            return False

        sqrtd = math.sqrt(discriminant)

        # -----------------------------
        # FIND NEAREST VALID ROOT
        # -----------------------------
        root = (h - sqrtd) / a

        if root < tmin or root > tmax:
            root = (h + sqrtd) / a
            if root < tmin or root > tmax:
                return False

        # -----------------------------
        # FILL HIT RECORD
        # -----------------------------
        rec.t = root
        rec.p = ray.at(rec.t)

        # outward normal (unit sphere direction)
        outward_normal = (rec.p - self.center) / self.radius

        rec.set_face_normal(ray, outward_normal)

        return True