from util.ray import Ray
from util.vec3 import (
    Vec3,
    unit_vector,
    random_on_hemisphere
)
from util.hit_record import HitRecord
from util.interval import Interval
from util.utility import INFINITY
from tqdm import tqdm
from util.image_viewer import image_viewer



class Camera:

    def __init__(self):
        self.aspect_ratio = 16 / 9
        self.image_width = 400
        self.samples_per_pixel = 100
        self.max_depth = 10

    # -----------------------------------
    # Setup
    # -----------------------------------
    def initialize(self):

        self.image_height = int(
            self.image_width / self.aspect_ratio
        )

        if self.image_height < 1:
            self.image_height = 1

        self.pixel_samples_scale = (
            1.0 / self.samples_per_pixel
        )

        self.center = Vec3(0, 0, 0)

        focal_length = 1.0
        viewport_height = 2.0
        viewport_width = (
            viewport_height *
            (self.image_width / self.image_height)
        )

        viewport_u = Vec3(viewport_width, 0, 0)
        viewport_v = Vec3(0, -viewport_height, 0)

        self.pixel_delta_u = (
            viewport_u / self.image_width
        )

        self.pixel_delta_v = (
            viewport_v / self.image_height
        )

        viewport_upper_left = (
            self.center
            - Vec3(0, 0, focal_length)
            - viewport_u / 2
            - viewport_v / 2
        )

        self.pixel00_loc = (
            viewport_upper_left
            + 0.5 * (
                self.pixel_delta_u +
                self.pixel_delta_v
            )
        )

    # -----------------------------------
    # Random subpixel
    # -----------------------------------
    def sample_square(self):
        import random

        return Vec3(
            random.random() - 0.5,
            random.random() - 0.5,
            0
        )

    # -----------------------------------
    # Build ray
    # -----------------------------------
    def get_ray(self, i, j):

        offset = self.sample_square()

        pixel_sample = (
            self.pixel00_loc
            + (i + offset.x) * self.pixel_delta_u
            + (j + offset.y) * self.pixel_delta_v
        )

        ray_direction = pixel_sample - self.center

        return Ray(self.center, ray_direction)

    # -----------------------------------
    # Recursive diffuse light
    # -----------------------------------
    def ray_color(self, r, world, depth):

        if depth <= 0:
            return Vec3(0, 0, 0)

        rec = HitRecord()

        if world.hit(
            r,
            Interval(0.001, INFINITY),
            rec
        ):
            direction = random_on_hemisphere(
                rec.normal
            )

            return 0.5 * self.ray_color(
                Ray(rec.p, direction),
                world,
                depth - 1
            )

        unit_dir = unit_vector(r.direction())

        t = 0.5 * (unit_dir.y + 1.0)

        white = Vec3(1, 1, 1)
        blue = Vec3(0.5, 0.7, 1.0)

        return (
            (1.0 - t) * white +
            t * blue
        )

    # -----------------------------------
    # Render
    # -----------------------------------
    def render(self, world):

        self.initialize()

        with open("output.ppm", "w") as f:

            f.write(
                f"P3\n{self.image_width} "
                f"{self.image_height}\n255\n"
            )

            for j in tqdm(range(self.image_height)):

                for i in range(self.image_width):

                    pixel_color = Vec3(0, 0, 0)

                    for _ in range(
                        self.samples_per_pixel
                    ):

                        r = self.get_ray(i, j)

                        pixel_color += self.ray_color(r, world, self.max_depth)

                    pixel_color *= (self.pixel_samples_scale)

                    ir = int(255.999 * pixel_color.x)
                    ig = int(255.999 * pixel_color.y)
                    ib = int(255.999 * pixel_color.z)

                    f.write(
                        f"{ir} {ig} {ib}\n"
                    )

    def show(self):
        """
        Display output image
        """
        return image_viewer("output.ppm")
