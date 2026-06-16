import math


class Vec3:
    def __init__(self, x=0, y=0, z=0):
        self.e = [x, y, z]

    # Accessors
    @property
    def x(self):
        return self.e[0]

    @property
    def y(self):
        return self.e[1]

    @property
    def z(self):
        return self.e[2]

    # Negative vector
    def __neg__(self):
        return Vec3(-self.e[0], -self.e[1], -self.e[2])

    # Index access
    def __getitem__(self, i):
        return self.e[i]

    def __setitem__(self, i, value):
        self.e[i] = value

    # Addition
    def __add__(self, other):
        return Vec3(
            self.e[0] + other.e[0],
            self.e[1] + other.e[1],
            self.e[2] + other.e[2]
        )

    # Subtraction
    def __sub__(self, other):
        return Vec3(
            self.e[0] - other.e[0],
            self.e[1] - other.e[1],
            self.e[2] - other.e[2]
        )

    # Multiplication
    def __mul__(self, t):
        if isinstance(t, Vec3):
            return Vec3(
                self.e[0] * t.e[0],
                self.e[1] * t.e[1],
                self.e[2] * t.e[2]
            )
        return Vec3(
            self.e[0] * t,
            self.e[1] * t,
            self.e[2] * t
        )
    
    # Reverse multiplication
    def __rmul__(self, t):
       return self.__mul__(t)

    # Division
    def __truediv__(self, t):
        return self * (1 / t)

    # Length squared
    def length_squared(self):
        return (
            self.e[0]**2 +
            self.e[1]**2 +
            self.e[2]**2
        )

    # Length
    def length(self):
        return math.sqrt(self.length_squared())

    def __str__(self):
        return f"{self.e[0]} {self.e[1]} {self.e[2]}"


# Dot product
def dot(u, v):
    return u.e[0]*v.e[0] + u.e[1]*v.e[1] + u.e[2]*v.e[2]


# Cross product
def cross(u, v):
    return Vec3(
        u.e[1]*v.e[2] - u.e[2]*v.e[1],
        u.e[2]*v.e[0] - u.e[0]*v.e[2],
        u.e[0]*v.e[1] - u.e[1]*v.e[0]
    )


# Unit vector
def unit_vector(v):
    return v / v.length()


Point3 = Vec3
Color = Vec3 