from util.hittable import Hittable

class Sphere(Hittable):
    def __init__(self, center, radius):
        self.center = center
        self.radius = max(0.0, radius)

    def hit(self, ray, tmin, tmax, rec):

        oc = self.center - ray.origin

        a = ray.direction.length_squared()
        h = ray.direction.dot(oc)
        c = oc.length_squared() - self.radius * self.radius

        discriminant = h*h - a*c

        if discriminant < 0:
            return False

        sqrtd = math.sqrt(discriminant)

        # first root
        root = (h - sqrtd) / a
        if root <= tmin or root >= tmax:
            root = (h + sqrtd) / a
            if root <= tmin or root >= tmax:
                return False

        rec.t = root
        rec.p = ray.at(rec.t)

        # normal = (P - center) / radius
        rec.normal = (rec.p - self.center) * (1.0 / self.radius)

        return True