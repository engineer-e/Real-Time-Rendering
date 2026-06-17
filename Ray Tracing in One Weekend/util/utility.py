import random

INFINITY = float("inf")


# -----------------------------------
# RANDOM UTILITIES
# -----------------------------------

def random_double():
    """
    Returns a random real in [0,1)

    Formula:
    r ∈ [0,1)
    """
    return random.random()


def random_double_range(min_val, max_val):
    """
    Returns random real in [min,max)

    Formula:
    x = min + (max-min)r
    where r ∈ [0,1)
    """
    return min_val + (max_val - min_val) * random_double()