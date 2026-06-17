from typing import List, Optional
from util.hit_record import HitRecord
from util.hittable import Hittable
# We assume these exist already:
# Ray, HitRecord, Hittable
class HittableList:
    def __init__(self, obj=None):
        self.objects = []
        if obj is not None:
            self.add(obj)

    def add(self, obj):
        self.objects.append(obj)

    def hit(self, ray, tmin, tmax, rec):

        temp = HitRecord()
        hit_any = False
        closest = tmax

        for obj in self.objects:

            if obj.hit(ray, tmin, closest, temp):
                hit_any = True
                closest = temp.t
                rec.copy(temp)

        return hit_any