import math
import random


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
        return self * (1 / t)

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


def unit_vector(v):
    return v / v.length()


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


Point3 = Vec3
Color = Vec3