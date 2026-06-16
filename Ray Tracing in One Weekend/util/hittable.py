from abc import ABC, abstractmethod

class Hittable(ABC):

    @abstractmethod
    def hit(self, ray, tmin, tmax, rec):
        pass