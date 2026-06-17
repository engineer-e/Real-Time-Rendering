from util.vec3 import dot


class HitRecord:
    def __init__(self):
        # Hit point (NEW: stores where ray hit)
        self.p = None

        # Surface normal (already existed)
        self.normal = None

        # NEW: material pointer/reference
        # Before: no material info
        # Now: allows ray_color() to call material.scatter()
        self.mat = None

        # Distance along ray
        self.t = 0.0

        # NEW: tells whether ray hit outside or inside
        self.front_face = False

    def copy(self, other):
        # Copy all values from another hit record

        self.p = other.p
        self.normal = other.normal

        # NEW: copy material too
        self.mat = other.mat

        self.t = other.t
        self.front_face = other.front_face

    def set_face_normal(self, ray, outward_normal):
        """
        NEW FUNCTION IMPROVEMENT:
        Before:
            rec.normal = outward_normal

        Problem:
            if ray comes from inside sphere,
            normal direction becomes wrong.

        Now:
            normal always opposes incoming ray.
        """

        # Formula:
        # front_face = D.N < 0
        self.front_face = dot(ray.direction(), outward_normal) < 0

        # If outside → normal stays same
        if self.front_face:
            self.normal = outward_normal
        else:
            # If inside → flip normal
            self.normal = outward_normal * -1