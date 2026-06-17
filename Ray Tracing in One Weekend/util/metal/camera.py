import math
import random

from tqdm import tqdm

from util.ray import Ray
from util.vec3 import Vec3, unit_vector
from util.interval import Interval
from util.metal.hit_record import HitRecord

from util.image_viewer import image_viewer
from util.sys_monitor import system_monitor


class Camera:

    def __init__(self):

        # ==========================================
        # IMAGE SETTINGS
        # ==========================================
        self.aspect_ratio = 16 / 9
        self.image_width = 400
        self.samples_per_pixel = 100
        self.max_depth = 50

    # ==========================================
    # INITIALIZATION
    # ==========================================
    def initialize(self):

        self.image_height = max(
            1,
            int(self.image_width / self.aspect_ratio)
        )

        self.pixel_samples_scale = 1.0 / self.samples_per_pixel

        self.center = Vec3(0, 0, 0)

        focal_length = 1.0
        viewport_height = 2.0
        viewport_width = viewport_height * (
            self.image_width / self.image_height
        )

        viewport_u = Vec3(viewport_width, 0, 0)
        viewport_v = Vec3(0, -viewport_height, 0)

        self.pixel_delta_u = viewport_u / self.image_width
        self.pixel_delta_v = viewport_v / self.image_height

        viewport_upper_left = (
            self.center
            - Vec3(0, 0, focal_length)
            - viewport_u / 2
            - viewport_v / 2
        )

        self.pixel00_loc = viewport_upper_left + 0.5 * (
            self.pixel_delta_u + self.pixel_delta_v
        )

    # ==========================================
    # RANDOM SUBPIXEL SAMPLING
    # ==========================================
    def sample_square(self):
        return Vec3(
            random.random() - 0.5,
            random.random() - 0.5,
            0
        )

    # ==========================================
    # RAY GENERATION
    # ==========================================
    def get_ray(self, i, j):

        offset = self.sample_square()

        pixel_sample = (
            self.pixel00_loc
            + (i + offset.x) * self.pixel_delta_u
            + (j + offset.y) * self.pixel_delta_v
        )

        direction = pixel_sample - self.center

        return Ray(self.center, direction)

    # ==========================================
    # PATH TRACING CORE (FIXED)
    # ==========================================
    def ray_color(self, ray, world, depth):

        # STOP CONDITION
        if depth <= 0:
            return Vec3(0, 0, 0)

        rec = HitRecord()

        # ✔ FIX: ALWAYS USE INTERVAL
        hit = world.hit(
            ray,
            Interval(0.001, float("inf")),
            rec
        )

        # ==========================================
        # HIT OBJECT
        # ==========================================
        if hit:

            material = rec.mat

            scattered, attenuation = material.scatter(
                ray,
                rec
            )

            return attenuation * self.ray_color(
                scattered,
                world,
                depth - 1
            )

        # ==========================================
        # SKY GRADIENT
        # ==========================================
        unit_dir = unit_vector(ray.direction())

        t = 0.5 * (unit_dir.y + 1.0)

        return (1.0 - t) * Vec3(1, 1, 1) + t * Vec3(0.5, 0.7, 1.0)

    # ==========================================
    # GAMMA CORRECTION
    # ==========================================
    def linear_to_gamma(self, x):
        return math.sqrt(x) if x > 0 else 0

    def gamma_correct(self, color):
        return Vec3(
            self.linear_to_gamma(color.x),
            self.linear_to_gamma(color.y),
            self.linear_to_gamma(color.z)
        )

    # ==========================================
    # RENDER LOOP
    # ==========================================
    def render(self, world):

        self.initialize()

        with open("output.ppm", "w") as f:

            f.write(
                f"P3\n"
                f"{self.image_width} {self.image_height}\n"
                f"255\n"
            )

            pbar = tqdm(range(self.image_height))

            for j in pbar:

                if j % 5 == 0:
                    pbar.set_postfix(system_monitor())

                for i in range(self.image_width):

                    pixel_color = Vec3(0, 0, 0)

                    # MULTI-SAMPLING
                    for _ in range(self.samples_per_pixel):

                        ray = self.get_ray(i, j)

                        pixel_color += self.ray_color(
                            ray,
                            world,
                            self.max_depth
                        )

                    # AVERAGE
                    pixel_color *= self.pixel_samples_scale

                    # GAMMA
                    pixel_color = self.gamma_correct(pixel_color)

                    # CLAMP
                    r = min(max(pixel_color.x, 0), 0.999)
                    g = min(max(pixel_color.y, 0), 0.999)
                    b = min(max(pixel_color.z, 0), 0.999)

                    # WRITE PIXEL
                    f.write(f"{int(256*r)} {int(256*g)} {int(256*b)}\n")

    # ==========================================
    # VIEW OUTPUT
    # ==========================================
    def show(self):
        return image_viewer("output.ppm")