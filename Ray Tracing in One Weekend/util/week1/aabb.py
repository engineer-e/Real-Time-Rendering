from util.vec3 import Vec3

class AABB:

    def __init__(self, minimum, maximum):
        self.min = minimum
        self.max = maximum

    def hit(self, ray, t_interval):

        for axis in range(3):

            origin = ray.origin().xyz[axis]
            direction = ray.direction().xyz[axis]

            # IMPORTANT: avoid divide-by-zero
            if abs(direction) < 1e-8:
                # Ray is parallel to slab → reject if origin not inside
                if origin < self.min.xyz[axis] or origin > self.max.xyz[axis]:
                    return False
                continue

            inv_d = 1.0 / direction

            t0 = (self.min.xyz[axis] - origin) * inv_d
            t1 = (self.max.xyz[axis] - origin) * inv_d

            if inv_d < 0:
                t0, t1 = t1, t0

            if t0 > t_interval.min:
                t_interval.min = t0

            if t1 < t_interval.max:
                t_interval.max = t1

            if t_interval.max <= t_interval.min:
                return False

        return True

    def surround(self, other):

        small = Vec3(
            min(self.min.x, other.min.x),
            min(self.min.y, other.min.y),
            min(self.min.z, other.min.z),
        )

        big = Vec3(
            max(self.max.x, other.max.x),
            max(self.max.y, other.max.y),
            max(self.max.z, other.max.z),
        )

        return AABB(small, big)