from util.week1.vec3 import Vec3

# ray.py

Point3 = Vec3   # point is just a vector

class Ray:
    def __init__(self, origin, direction):
        self.orig = origin
        self.dir = direction

    def origin(self):
        return self.orig

    def direction(self):
        return self.dir

    def at(self, t):
        return self.orig + t * self.dir

