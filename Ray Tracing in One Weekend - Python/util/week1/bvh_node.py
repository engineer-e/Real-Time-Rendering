import random
from util.interval import Interval

class BVHNode:

    def __init__(self, objects):

        axis = random.randint(0, 2)

        # SORT BY RANDOM AXIS (IMPORTANT FIX)
        objects.sort(key=lambda obj: obj.bounding_box().min.xyz[axis])

        if len(objects) == 1:
            self.left = self.right = objects[0]

        elif len(objects) == 2:
            self.left = objects[0]
            self.right = objects[1]

        else:
            mid = len(objects) // 2
            self.left = BVHNode(objects[:mid])
            self.right = BVHNode(objects[mid:])

        box_left = self.left.bounding_box()
        box_right = self.right.bounding_box()

        self.box = box_left.surround(box_right)

    def hit(self, ray, t_interval, rec):

        if not self.box.hit(ray, t_interval):
            return False

        hit_left = self.left.hit(ray, t_interval, rec)

        # IMPORTANT: shrink interval for correctness
        hit_right = self.right.hit(
            ray,
            Interval(t_interval.min, t_interval.max),
            rec
        )

        return hit_left or hit_right

    def bounding_box(self):
        return self.box