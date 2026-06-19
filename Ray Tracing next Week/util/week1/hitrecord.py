from util.week1.vec3 import dot


class HitRecord:
    def __init__(self):

        # ==========================================
        # Hit position
        # ==========================================
        self.p = None

        # ==========================================
        # Surface normal (final corrected normal)
        # ==========================================
        self.normal = None

        # ==========================================
        # Material at hit point
        # ==========================================
        self.mat = None

        # ==========================================
        # Ray parameter
        # ==========================================
        self.t = 0.0

        # ==========================================
        # Whether ray hit outside surface
        # ==========================================
        self.front_face = False

    # ==========================================
    # COPY HIT RECORD
    # ==========================================
    def copy(self, other):
        self.p = other.p
        self.normal = other.normal
        self.mat = other.mat
        self.t = other.t
        self.front_face = other.front_face

    # ==========================================
    # FIX NORMAL DIRECTION
    #
    # FORMULA:
    # front_face = dot(D, N) < 0
    # ==========================================
    def set_face_normal(self, ray, outward_normal):

        self.front_face = dot(ray.direction(), outward_normal) < 0

        # IMPORTANT FIX:
        # always assign in one line (clean + safe)
        self.normal = (
            outward_normal
            if self.front_face
            else -outward_normal
        )