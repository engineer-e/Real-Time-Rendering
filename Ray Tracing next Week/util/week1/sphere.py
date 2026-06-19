import math
from util.week1.vec3 import dot
from util.week1.hittable import Hittable

class Sphere(Hittable):

    def __init__(self, center, radius, material):
        """
        CHANGED:
        Before:
            Sphere(center, radius)

        Now:
            Sphere(center, radius, material)

        Why:
            Sphere must know what material it has.
        """
        self.center = center
        self.radius = max(0.0, radius)

        # NEW: store material
        self.mat = material

    def hit(self, r, ray_t, rec):

        """
        Sphere equation:

        $$(P-C)\cdot(P-C)=r^2$$

        Ray equation:

        $$P=O+tD$$

        Substitute:

        $$(O+tD-C)\cdot(O+tD-C)=r^2$$
        """

        # Vector from ray origin to center
        oc = self.center - r.origin()

        # a = D.D
        a = dot(r.direction(), r.direction())

        # h = D.oc
        h = dot(r.direction(), oc)

        # c = oc.oc - r²
        c = dot(oc, oc) - self.radius * self.radius

        # discriminant
        # CHANGED:
        # optimized form
        # Before: b²-4ac
        # Now: h²-ac
        discriminant = h * h - a * c

        if discriminant < 0:
            # no real root → no hit
            return False

        sqrtd = math.sqrt(discriminant)

        # nearest root
        root = (h - sqrtd) / a

        if not ray_t.surrounds(root):
            root = (h + sqrtd) / a

            if not ray_t.surrounds(root):
                return False

        # store hit distance
        rec.t = root

        # hit point:
        # P = O + tD
        rec.p = r.at(root)

        # outward normal:
        # N = (P-C)/r
        outward_normal = (rec.p - self.center) / self.radius

        """
        CHANGED:
        Before:
            rec.normal = outward_normal

        Problem:
            wrong when ray starts inside sphere

        Now:
            set_face_normal() fixes direction
        """
        rec.set_face_normal(r, outward_normal)

        """
        NEW:
        assign material to hit record
        This connects geometry → material behavior
        """
        rec.mat = self.mat

        return True