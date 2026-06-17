import math
import random
import numpy as np

class Vec3:
    def __init__(self, x=0, y=0, z=0):
        self.e = [x, y, z]

    # --------------------------
    # Properties
    # --------------------------
    @property
    def x(self):
        return self.e[0]

    @property
    def y(self):
        return self.e[1]

    @property
    def z(self):
        return self.e[2]

    # --------------------------
    # Operators
    # --------------------------
    def __neg__(self):
        return Vec3(-self.x, -self.y, -self.z)

    def __add__(self, other):
        return Vec3(
            self.x + other.x,
            self.y + other.y,
            self.z + other.z
        )

    def __sub__(self, other):
        return Vec3(
            self.x - other.x,
            self.y - other.y,
            self.z - other.z
        )

    def __mul__(self, t):
        if isinstance(t, Vec3):
            return Vec3(
                self.x * t.x,
                self.y * t.y,
                self.z * t.z
            )

        return Vec3(
            self.x * t,
            self.y * t,
            self.z * t
        )

    def __rmul__(self, t):
        return self.__mul__(t)

    def __truediv__(self, t):
     # CHANGE: avoid divide-by-zero crashes in normalization
     return self * (1 / (t if t != 0 else 1e-12))

    def __str__(self):
        return f"{self.x} {self.y} {self.z}"

    # --------------------------
    # Length
    # --------------------------
    def length_squared(self):
        return (
            self.x * self.x +
            self.y * self.y +
            self.z * self.z
        )

    def length(self):
        return math.sqrt(self.length_squared())

    # --------------------------
    # NEW: Near-zero check
    #
    # Purpose:
    # Detect vectors very close to (0,0,0)
    #
    # Formula:
    #
    # |x| < ε
    # |y| < ε
    # |z| < ε
    #
    # where ε = 10^-8
    # --------------------------
    def near_zero(self):

        s = 1e-8

        return (
            abs(self.x) < s
            and abs(self.y) < s
            and abs(self.z) < s
        )

    # --------------------------
    # Random vectors
    # --------------------------
    @staticmethod
    def random():
        return Vec3(
            random.random(),
            random.random(),
            random.random()
        )

    @staticmethod
    def random_range(min_v, max_v):
        return Vec3(
            random.uniform(min_v, max_v),
            random.uniform(min_v, max_v),
            random.uniform(min_v, max_v)
        )


# --------------------------
# Utility functions
# --------------------------
def dot(u, v):
    return (
        u.x * v.x +
        u.y * v.y +
        u.z * v.z
    )


def cross(u, v):
    return Vec3(
        u.y * v.z - u.z * v.y,
        u.z * v.x - u.x * v.z,
        u.x * v.y - u.y * v.x
    )


#def unit_vector(v):
#    return v / v.length()


# --------------------------
# Diffuse helpers
# --------------------------
def random_unit_vector():
    """
    Rejection sampling inside unit sphere
    """

    while True:
        p = Vec3.random_range(-1, 1)

        lensq = p.length_squared()

        if 1e-160 < lensq <= 1:
            return p / math.sqrt(lensq)


def random_on_hemisphere(normal):
    """
    Keep ray in outward hemisphere
    """

    on_unit_sphere = random_unit_vector()

    if dot(on_unit_sphere, normal) > 0.0:
        return on_unit_sphere

    return -on_unit_sphere

# =========================
# Unit vector (normalization)
# =========================
def unit_vector(v):
    len_v = v.length()

    # CHANGE:
    # prevents NaN when vector is zero
    if len_v < 1e-12:
        return Vec3(0, 0, 0)

    return v / len_v


# =========================
# REFLECTION FUNCTION
# =========================
def reflect(v, n):
    """
    PURPOSE:
    Mirror reflection of vector v around normal n

    FORMULA:
        r = v - 2(v·n)n

    WHY:
    - removes normal component twice
    - flips direction symmetrically
    """

    return v - 2 * dot(v, n) * n

def refract(uv, n, etai_over_etat):
    """
    uv: unit direction of incoming ray
    n : surface normal
    etai_over_etat: ratio of refractive indices (η / η')
    """

    # STEP 1: compute cos(theta)
    # CHANGED: we use dot product instead of angle
    cos_theta = min((-uv).dot(n), 1.0)

    # STEP 2: perpendicular component (bending part)
    # CHANGED: scales direction using Snell’s Law form
    r_out_perp = (uv + n * cos_theta) * etai_over_etat

    # STEP 3: parallel component (keeps unit length)
    # CHANGED: ensures physical constraint |R'| = 1
    r_out_parallel = n * (-math.sqrt(abs(1.0 - r_out_perp.length_squared())))

    # STEP 4: final refracted ray
    return r_out_perp + r_out_parallel

Point3 = Vec3
Color = Vec3