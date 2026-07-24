# util/interval.py

class Interval:

    def __init__(self, min_val=float("inf"), max_val=float("-inf")):
        """
        Default = empty interval
        """
        self.min = min_val
        self.max = max_val

    def size(self):
        """
        Length of interval
        Formula:
        size = max - min
        """
        return self.max - self.min

    def contains(self, x):
        """
        Inclusive:
        min <= x <= max
        """
        return self.min <= x <= self.max

    def surrounds(self, x):
        """
        Strict:
        min < x < max
        """
        return self.min < x < self.max

    def clamp(self, x):
        """
        Clamp x into [min,max]
        """

        if x < self.min:
            return self.min

        if x > self.max:
            return self.max

        return x


# Static intervals
Interval.empty = Interval(float("inf"), float("-inf"))
Interval.universe = Interval(float("-inf"), float("inf"))