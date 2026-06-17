from util.vec3 import dot

class HitRecord:
    def __init__(self):
        self.p = None
        self.normal = None
        self.t = 0.0
        self.front_face = False

    def copy(self, other):
        self.p = other.p
        self.normal = other.normal
        self.t = other.t
        self.front_face = other.front_face

    def set_face_normal(self, ray, outward_normal):
        # dot(ray.direction, outward_normal) < 0 means ray is outside

        # Check if ray is outside or inside
        # self.front_face = ray.direction().dot(outward_normal) < 0
        self.front_face = dot(ray.direction(), outward_normal) < 0

        # Always store consistent normal direction
        if self.front_face:
            self.normal = outward_normal
        else:
            self.normal = outward_normal * -1

