import math
from util.hittable import Hittable
from util.vec3 import dot

class Sphere(Hittable):

    def __init__(self, center, radius):
        self.center = center
        self.radius = max(0.0, radius)

    def hit(self, r, ray_t, rec):

        oc = self.center - r.origin()

        a = dot(r.direction(), r.direction())
        h = dot(r.direction(), oc)
        c = dot(oc, oc) - self.radius * self.radius

        discriminant = h*h - a*c

        if discriminant < 0:
            return False

        sqrtd = math.sqrt(discriminant)

        # nearest root
        root = (h - sqrtd) / a

        if not ray_t.surrounds(root):
            root = (h + sqrtd) / a

            if not ray_t.surrounds(root):
                return False

        rec.t = root
        rec.p = r.at(root)

        outward_normal = (rec.p - self.center) / self.radius
        rec.normal = outward_normal

        return True