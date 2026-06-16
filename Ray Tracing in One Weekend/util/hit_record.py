class HitRecord:
    def __init__(self):
        self.p = None
        self.normal = None
        self.t = 0.0
        self.front_face = False

    def set_face_normal(self, ray, outward_normal):
        # dot(ray.direction, outward_normal) < 0 means ray is outside

        self.front_face = ray.direction.dot(outward_normal) < 0

        if self.front_face:
            self.normal = outward_normal
        else:
            self.normal = outward_normal * -1