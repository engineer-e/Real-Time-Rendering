from util.ray import Ray
from util.vec3 import Vec3, unit_vector
from util.hit_record import HitRecord
from util.interval import Interval
from util.image_viewer import image_viewer
from tqdm import tqdm

import math

INFINITY = float("inf")


class Camera:
    """
    Camera class handles:
    1. Building rays
    2. Rendering image
    """

    # -----------------------------------
    # PUBLIC VARIABLES
    # User can modify these directly
    # -----------------------------------
    def __init__(self):
        self.aspect_ratio = 16 / 9
        self.image_width = 400

    # -----------------------------------
    # MAIN RENDER FUNCTION
    # -----------------------------------
    def render(self, world):

        # Auto initialize before rendering
        self.initialize()

        with open("output.ppm", "w") as f:

            # PPM Header
            f.write(f"P3\n{self.image_width} {self.image_height}\n255\n")

            # Scan every pixel
            for j in tqdm(range(self.image_height), desc="Rendering"):
                for i in range(self.image_width):

                    # Get ray for current pixel
                    r = self.get_ray(i, j)

                    # Compute color
                    pixel_color = self.ray_color(r, world)

                    ir = int(255.999 * pixel_color.x)
                    ig = int(255.999 * pixel_color.y)
                    ib = int(255.999 * pixel_color.z)

                    f.write(f"{ir} {ig} {ib}\n")

        print("Done!")
        pass

    # -----------------------------------
    # INITIALIZATION
    # -----------------------------------
    def initialize(self):

        # Compute image height
        self.image_height = int(self.image_width / self.aspect_ratio)

        if self.image_height < 1:
            self.image_height = 1

        # Camera center
        self.center = Vec3(0, 0, 0)

        # Viewport setup
        focal_length = 1.0
        viewport_height = 2.0
        viewport_width = viewport_height * (
            self.image_width / self.image_height
        )

        # Horizontal vector
        viewport_u = Vec3(viewport_width, 0, 0)

        # Vertical vector
        viewport_v = Vec3(0, -viewport_height, 0)

        # Pixel size
        self.pixel_delta_u = viewport_u / self.image_width
        self.pixel_delta_v = viewport_v / self.image_height

        # Top-left viewport corner
        viewport_upper_left = (
            self.center
            - Vec3(0, 0, focal_length)
            - viewport_u / 2
            - viewport_v / 2
        )

        # First pixel center
        self.pixel00_loc = (
            viewport_upper_left
            + 0.5 * (self.pixel_delta_u + self.pixel_delta_v)
        )

    # -----------------------------------
    # BUILD RAY FOR A PIXEL
    # -----------------------------------
    def get_ray(self, i, j):

        pixel_center = (
            self.pixel00_loc
            + self.pixel_delta_u * i
            + self.pixel_delta_v * j
        )

        ray_direction = pixel_center - self.center

        return Ray(self.center, ray_direction)

    # -----------------------------------
    # RAY COLOR LOGIC
    # -----------------------------------
    def ray_color(self, r, world):

        rec = HitRecord()

        if world.hit(r, Interval(0.001, INFINITY), rec):
            return 0.5 * (rec.normal + Vec3(1, 1, 1))

        unit_dir = unit_vector(r.direction())

        t = 0.5 * (unit_dir.y + 1.0)

        white = Vec3(1, 1, 1)
        blue = Vec3(0.5, 0.7, 1.0)

        return white * (1 - t) + blue * t

    def show(self):
        a = image_viewer("output.ppm")
        return a
