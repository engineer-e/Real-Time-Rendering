from abc import ABC, abstractmethod

class Hittable(ABC):

    @abstractmethod
    def hit(self, ray, ray_t, rec):
        pass

