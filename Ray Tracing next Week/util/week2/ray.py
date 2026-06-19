# ray.py

from util.week1.vec3 import Vec3

# Point3 is just Vec3 (same as before)
Point3 = Vec3


class Ray:
    def __init__(self, origin, direction, time=0.0):
        """
        OLD:
            def __init__(self, origin, direction)

        NEW:
            Added 'time'

        PURPOSE:
            Stores when this ray exists.
            Needed for motion blur.
        """
        
        # Same as before
        self.orig = origin
        
        # Same as before
        self.dir = direction
        
        # NEW: store ray time
        self.tm = time

    def origin(self):
        """
        Same as before.
        Returns ray starting point.
        """
        return self.orig

    def direction(self):
        """
        Same as before.
        Returns ray direction.
        """
        return self.dir

    def time(self):
        """
        NEW function.

        Returns time of this ray.
        Used by moving objects.
        """
        return self.tm

    def at(self, t):
        """
        Same formula as before:

        P(t) = O + tD

        where:
            O = origin
            D = direction
            t = distance

        Returns point along ray.
        """
        return self.orig + t * self.dir