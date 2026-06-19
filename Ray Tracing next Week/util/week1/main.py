import math
import random
import numpy as np

from util.week1.vec3 import Vec3
from util.week1.hittablelist import HittableList
from util.week1.camera import Camera
from util.week1.lambertian import Lambertian
from util.week1.dielectric import Dielectric
from util.week1.metal import Metal
from util.week1.sphere import Sphere

# ============================================================
# RANDOM HELPERS (C++ → Python equivalent)
# ============================================================
def random_double(min_val=0.0, max_val=1.0):
    return min_val + (max_val - min_val) * random.random()


def random_color(min_val=0.0, max_val=1.0):
    return Vec3(
        random_double(min_val, max_val),
        random_double(min_val, max_val),
        random_double(min_val, max_val),
    )


# ============================================================
# BUILD WORLD (NO main wrapper)
# ============================================================

world = HittableList()

# --------------------------
# Ground (big sphere)
# --------------------------
ground_material = Lambertian(Vec3(0.5, 0.5, 0.5))

world.add(
    Sphere(
        center=Vec3(0, -1000, 0),
        radius=1000,
        material=ground_material
    )
)

# --------------------------
# Random small spheres
# --------------------------
for a in range(-11, 11):
    for b in range(-11, 11):

        choose_mat = random_double()

        center = Vec3(
            a + 0.9 * random_double(),
            0.2,
            b + 0.9 * random_double()
        )

        # avoid overlap with main center sphere
        if (center - Vec3(4, 0.2, 0)).length() > 0.9:

            # diffuse
            if choose_mat < 0.8:

                albedo = random_color() * random_color()
                mat = Lambertian(albedo)

                world.add(Sphere(center, 0.2, mat))

            # metal
            elif choose_mat < 0.95:

                albedo = random_color(0.5, 1.0)
                fuzz = random_double(0.0, 0.5)

                mat = Metal(albedo, fuzz)

                world.add(Sphere(center, 0.2, mat))

            # glass
            else:

                mat = Dielectric(1.5)

                world.add(Sphere(center, 0.2, mat))


# --------------------------
# Big center objects
# --------------------------
world.add(Sphere(Vec3(0, 1, 0), 1.0, Dielectric(1.5)))
world.add(Sphere(Vec3(-4, 1, 0), 1.0, Lambertian(Vec3(0.4, 0.2, 0.1))))
world.add(Sphere(Vec3(4, 1, 0), 1.0, Metal(Vec3(0.7, 0.6, 0.5), 0.0)))


# ============================================================
# CAMERA SETUP
# ============================================================

cam = Camera()

cam.aspect_ratio = 16.0 / 9.0
cam.image_width = 100
cam.samples_per_pixel = 1
cam.max_depth = 50

cam.vfov = 20

# camera position (important change)
cam.lookfrom = Vec3(13, 2, 3)
cam.lookat   = Vec3(0, 0, 0)
cam.vup      = Vec3(0, 1, 0)

# defocus blur
cam.defocus_angle = 0.6
cam.focus_dist = 10.0


# =========================
# READY TO RENDER
# =========================
cam.render(world)


# =========================
# View TO RENDER
# =========================
cam.show()
