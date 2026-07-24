from abc import ABC, abstractmethod

class Material(ABC):
    """
    Abstract base class for all materials.
    Every material must define how rays scatter.
    """

    @abstractmethod
    def scatter(self, r_in, rec):
        """
        Parameters:
            r_in : incoming ray
            rec  : hit record

        Returns:
            (did_scatter, attenuation, scattered_ray)
        """
        pass