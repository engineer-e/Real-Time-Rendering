from util.metal.hit_record import HitRecord
from util.interval import Interval


class HittableList:

    def __init__(self, obj=None):
        self.objects = []
        if obj is not None:
            self.add(obj)

    def add(self, obj):
        self.objects.append(obj)

    def hit(self, ray, ray_t, rec):

        # ==========================================
        # TEMP RECORD (used for comparisons)
        # ==========================================
        temp_rec = HitRecord()

        hit_anything = False

        # IMPORTANT FIX:
        # ray_t MUST be Interval (not float)
        closest_so_far = ray_t.max

        for obj in self.objects:

            # Shrink valid interval each hit
            interval = Interval(ray_t.min, closest_so_far)

            if obj.hit(ray, interval, temp_rec):

                hit_anything = True
                closest_so_far = temp_rec.t

                # copy valid hit into final record
                rec.copy(temp_rec)

        return hit_anything