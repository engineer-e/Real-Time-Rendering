import math
import random
import os

from tqdm import tqdm

from util.ray import Ray
from util.vec3 import Vec3, unit_vector, cross
from util.interval import Interval
from util.metal.hit_record import HitRecord

from util.image_viewer import image_viewer
from util.sys_monitor import system_monitor


class Camera:

    def __init__(self):

        # ==========================
        # IMAGE SETTINGS
        # ==========================
        self.aspect_ratio = 16 / 9
        self.image_width = 400
        self.samples_per_pixel = 100
        self.max_depth = 50

        # ==========================
        # CAMERA SETTINGS
        # ==========================
        self.vfov = 90

        self.lookfrom = Vec3(0, 0, 0)
        self.lookat   = Vec3(0, 0, -1)
        self.vup      = Vec3(0, 1, 0)

        # ==========================
        # LENS (DEPTH OF FIELD)
        # ==========================
        self.defocus_angle = 0.0
        self.focus_dist = 1.0

        self.output_file = "output.ppm"

        # optional reproducibility (VERY IMPORTANT for CPU parallel debugging)
        self.seed = 1234

    # =========================================================
    # INITIALIZE CAMERA GEOMETRY
    # =========================================================
    def initialize(self):

        random.seed(self.seed)

        self.image_height = max(
            1,
            int(self.image_width / self.aspect_ratio)
        )

        self.pixel_samples_scale = 1.0 / self.samples_per_pixel

        # camera basis
        self.center = self.lookfrom

        w = unit_vector(self.lookfrom - self.lookat)
        u = unit_vector(cross(self.vup, w))
        v = cross(w, u)

        self.u, self.v, self.w = u, v, w

        # viewport
        theta = math.radians(self.vfov)
        h = math.tan(theta / 2)

        viewport_height = 2 * h * self.focus_dist
        viewport_width = viewport_height * (self.image_width / self.image_height)

        viewport_u = viewport_width * u
        viewport_v = viewport_height * (-v)

        self.pixel_delta_u = viewport_u / self.image_width
        self.pixel_delta_v = viewport_v / self.image_height

        viewport_upper_left = (
            self.center
            - self.focus_dist * w
            - viewport_u / 2
            - viewport_v / 2
        )

        self.pixel00_loc = viewport_upper_left + 0.5 * (
            self.pixel_delta_u + self.pixel_delta_v
        )

        # defocus disk
        defocus_radius = self.focus_dist * math.tan(
            math.radians(self.defocus_angle / 2)
        )

        self.defocus_disk_u = u * defocus_radius
        self.defocus_disk_v = v * defocus_radius

    # =========================================================
    # RANDOM HELPERS
    # =========================================================
    def sample_square(self):
        r = random.random
        return Vec3(r() - 0.5, r() - 0.5, 0)

    def random_in_unit_disk(self):
        while True:
            p = Vec3(
                random.random() * 2 - 1,
                random.random() * 2 - 1,
                0
            )
            if p.x * p.x + p.y * p.y < 1:
                return p

    # =========================================================
    # RAY GENERATION
    # =========================================================
    def get_ray(self, i, j):

        offset = self.sample_square()

        pixel_sample = (
            self.pixel00_loc
            + (i + offset.x) * self.pixel_delta_u
            + (j + offset.y) * self.pixel_delta_v
        )

        if self.defocus_angle <= 0:
            origin = self.center
        else:
            p = self.random_in_unit_disk()
            origin = (
                self.center
                + p.x * self.defocus_disk_u
                + p.y * self.defocus_disk_v
            )

        return Ray(origin, pixel_sample - origin)

    # =========================================================
    # PATH TRACING
    # =========================================================
    def ray_color(self, ray, world, depth):

        if depth <= 0:
            return Vec3(0, 0, 0)

        rec = HitRecord()

        if world.hit(ray, Interval(0.001, float("inf")), rec):

            scattered, attenuation = rec.mat.scatter(ray, rec)

            return attenuation * self.ray_color(
                scattered,
                world,
                depth - 1
            )

        # sky gradient
        unit_dir = unit_vector(ray.direction())
        t = 0.5 * (unit_dir.y + 1.0)

        return (1 - t) * Vec3(1, 1, 1) + t * Vec3(0.5, 0.7, 1.0)

    # =========================================================
    # GAMMA CORRECTION
    # =========================================================
    def gamma(self, c):
        return Vec3(
            math.sqrt(c.x),
            math.sqrt(c.y),
            math.sqrt(c.z)
        )

    # =========================================================
    # VIEW IMAGE
    # =========================================================
    def show(self):
        if not os.path.exists(self.output_file):
            raise FileNotFoundError("Run render() first")
        return image_viewer(self.output_file)

    # =========================================================
    # RENDER (works with multiprocessing version you built)
    # =========================================================
    def render(self, world):
        self.initialize()

        with open(self.output_file, "w") as f:

            f.write("P3\n")
            f.write(f"{self.image_width} {self.image_height}\n")
            f.write("255\n")

            pbar = tqdm(range(self.image_height))

            for j in pbar:

                if j % 5 == 0:
                    pbar.set_postfix(system_monitor())

                for i in range(self.image_width):

                    pixel = Vec3(0, 0, 0)

                    for _ in range(self.samples_per_pixel):
                        ray = self.get_ray(i, j)
                        pixel += self.ray_color(ray, world, self.max_depth)

                    pixel *= self.pixel_samples_scale
                    pixel = self.gamma(pixel)

                    r = min(max(pixel.x, 0), 0.999)
                    g = min(max(pixel.y, 0), 0.999)
                    b = min(max(pixel.z, 0), 0.999)

                    f.write(f"{int(256*r)} {int(256*g)} {int(256*b)}\n")

        print("Render complete →", self.output_file)