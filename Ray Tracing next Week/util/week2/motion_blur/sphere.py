import math

from util.week1.vec3 import dot
from util.week1.hittable import Hittable
from util.week2.ray import Ray


class Sphere(Hittable):

    def __init__(
        self,
        center1,
        radius,
        material,
        center2=None
    ):
        """
        ============================================
        SPHERE CONSTRUCTOR
        ============================================

        Supports:

        1. Static sphere
        2. Moving sphere

        --------------------------------------------
        STATIC:

        Sphere(center, radius, material)

        center(t) = center

        --------------------------------------------
        MOVING:

        Sphere(center1, radius, material, center2)

        center(t)=center1+t(center2-center1)

        We store motion as a ray.
        """

        self.radius = max(0.0, radius)
        self.mat = material

        # ============================================
        # STATIC SPHERE
        # OLD behavior
        # ============================================
        if center2 is None:

            # CHANGED:
            # store zero-velocity ray
            self.center = Ray(
                center1,
                center1 * 0
            )

        # ============================================
        # MOVING SPHERE
        # NEW behavior
        # ============================================
        else:

            # center(t)=center1+t(center2-center1)

            self.center = Ray(
                center1,
                center2 - center1
            )

    # ==================================================
    # HIT TEST
    # ==================================================
    def hit(self, r, ray_t, rec):

        """
        ============================================
        STEP 1:
        Compute current center at ray time
        ============================================

        Formula:

        C(t)=C1+t(C2-C1)

        CHANGED:
        Before:
            fixed center

        Now:
            moving center
        """

        current_center = self.center.at(r.time())

        """
        Sphere equation:

        (P-C(t))·(P-C(t)) = r²

        Ray equation:

        P = O+tD
        """

        # ============================================
        # Vector from ray origin to moving center
        # ============================================
        oc = current_center - r.origin()

        # a = D·D
        a = dot(
            r.direction(),
            r.direction()
        )

        # h = D·oc
        h = dot(
            r.direction(),
            oc
        )

        # c = oc·oc - r²
        c = dot(
            oc,
            oc
        ) - self.radius * self.radius

        # ============================================
        # Discriminant
        #
        # h²-ac
        # ============================================
        discriminant = h * h - a * c

        if discriminant < 0:
            return False

        sqrtd = math.sqrt(discriminant)

        # ============================================
        # Find nearest root
        # ============================================
        root = (h - sqrtd) / a

        if not ray_t.surrounds(root):

            root = (h + sqrtd) / a

            if not ray_t.surrounds(root):
                return False

        # ============================================
        # Store hit
        # ============================================
        rec.t = root

        # P=O+tD
        rec.p = r.at(root)

        """
        ============================================
        CHANGED:
        normal uses current_center

        Before:
            rec.p - self.center

        Wrong for moving sphere

        Now:
            rec.p - current_center
        ============================================
        """

        outward_normal = (
            rec.p - current_center
        ) / self.radius

        rec.set_face_normal(
            r,
            outward_normal
        )

        # material
        rec.mat = self.mat

        return True