from util.ray import Ray
from util.vec3 import (
    Vec3,
    unit_vector,
    random_unit_vector
)
from util.hit_record import HitRecord
from util.interval import Interval
from util.utility import INFINITY
from tqdm import tqdm
from util.image_viewer import image_viewer
from util.sys_monitor import system_monitor
import random


class Camera:

    def __init__(self):

        # ==========================================
        # IMAGE SETTINGS
        # ==========================================

        # Aspect ratio:
        #
        # Formula:
        # width / height
        #
        # Purpose:
        # Controls image shape
        self.aspect_ratio = 16 / 9

        # Horizontal resolution
        self.image_width = 400

        # Anti-aliasing samples
        #
        # Formula:
        # FinalColor = Sum(samples)/N
        #
        # Purpose:
        # Reduces jagged edges and noise
        self.samples_per_pixel = 100

        # Maximum recursive ray bounces
        #
        # Purpose:
        # Prevent infinite recursion
        self.max_depth = 50

    def initialize(self):

        # ==========================================
        # Compute image height
        #
        # Formula:
        #
        # H = W / aspect_ratio
        # ==========================================
        self.image_height = int(
            self.image_width / self.aspect_ratio
        )

        if self.image_height < 1:
            self.image_height = 1

        # ==========================================
        # Pixel averaging scale
        #
        # Formula:
        #
        # scale = 1/N
        # ==========================================
        self.pixel_samples_scale = (
            1.0 / self.samples_per_pixel
        )

        # ==========================================
        # Camera position
        # ==========================================
        self.center = Vec3(0, 0, 0)

        # Distance from camera to viewport
        focal_length = 1.0

        # Physical viewport size
        viewport_height = 2.0
        viewport_width = (
            viewport_height *
            (self.image_width / self.image_height)
        )

        # ==========================================
        # Viewport basis vectors
        # ==========================================

        # Horizontal direction
        viewport_u = Vec3(
            viewport_width, 0, 0
        )

        # Vertical direction
        #
        # Negative y flips image correctly
        viewport_v = Vec3(
            0, -viewport_height, 0
        )

        # ==========================================
        # Pixel spacing
        #
        # Formula:
        #
        # Δu = viewport_u / width
        # Δv = viewport_v / height
        # ==========================================
        self.pixel_delta_u = (
            viewport_u / self.image_width
        )

        self.pixel_delta_v = (
            viewport_v / self.image_height
        )

        # ==========================================
        # Upper-left corner
        #
        # Formula:
        #
        # UL = center - focal - u/2 - v/2
        # ==========================================
        viewport_upper_left = (
            self.center
            - Vec3(0, 0, focal_length)
            - viewport_u / 2
            - viewport_v / 2
        )

        # First pixel center
        self.pixel00_loc = (
            viewport_upper_left
            + 0.5 * (
                self.pixel_delta_u
                + self.pixel_delta_v
            )
        )

    def sample_square(self):
        """
        Random subpixel sampling.

        Formula:
            random in [-0.5, 0.5]

        Purpose:
            Anti-aliasing
        """
        return Vec3(
            random.random() - 0.5,
            random.random() - 0.5,
            0
        )

    def get_ray(self, i, j):
        """
        Create ray for pixel (i,j)
        """

        # Random offset inside pixel
        offset = self.sample_square()

        # Sample point
        pixel_sample = (
            self.pixel00_loc
            + (i + offset.x) * self.pixel_delta_u
            + (j + offset.y) * self.pixel_delta_v
        )

        # Ray direction
        ray_direction = (
            pixel_sample - self.center
        )

        return Ray(
            self.center,
            ray_direction
        )

    def ray_color(self, r, world, depth):
        """
        Recursive ray tracing.
        """

        # ==========================================
        # Stop recursion
        # ==========================================
        if depth <= 0:
            return Vec3(0, 0, 0)

        rec = HitRecord()

        # ==========================================
        # Hit object
        # ==========================================
        if world.hit(
            r,
            Interval(0.001, INFINITY),
            rec
        ):

            # ==========================================
            # Lambertian scattering
            #
            # Formula:
            #
            # D = N + random_unit_vector()
            #
            # Purpose:
            # Random diffuse bounce
            # ==========================================
            direction = (
                rec.normal
                + random_unit_vector()
            )

            # Prevent zero vector
            if direction.near_zero():
                direction = rec.normal

            # ==========================================
            # Shadow acne fix
            #
            # Formula:
            #
            # P' = P + εN
            # ==========================================
            epsilon = 0.001

            scattered_origin = (
                rec.p
                + epsilon * rec.normal
            )

            scattered_ray = Ray(
                scattered_origin,
                direction
            )

            # ==========================================
            # Energy loss
            #
            # Changed from before:
            #
            # Reflection multiplier remains 0.5
            #
            # Formula:
            #
            # L = 0.5 × bounce
            # ==========================================
            return 0.5 * self.ray_color(
                scattered_ray,
                world,
                depth - 1
            )

        # ==========================================
        # Sky gradient
        #
        # Formula:
        #
        # lerp(white, blue, t)
        # ==========================================
        unit_dir = unit_vector(
            r.direction()
        )

        t = 0.5 * (
            unit_dir.y + 1.0
        )

        return (
            (1.0 - t)
            * Vec3(1, 1, 1)
            + t
            * Vec3(0.5, 0.7, 1.0)
        )

    # ==========================================
    # NEW: Gamma conversion
    #
    # Formula:
    #
    # gamma = linear^(1/gamma)
    #
    # For gamma=2:
    #
    # gamma = sqrt(linear)
    #
    # Changed from before:
    # Before we stored linear directly.
    # ==========================================
    def linear_to_gamma(self, value):

        if value > 0:
            return value ** 0.5

        return 0

    # ==========================================
    # NEW: Apply gamma to all channels
    # ==========================================
    def gamma_correct(self, color):

        return Vec3(
            self.linear_to_gamma(color.x),
            self.linear_to_gamma(color.y),
            self.linear_to_gamma(color.z)
        )

    def render(self, world):

        # Setup camera
        self.initialize()

        with open("output.ppm", "w") as f:

            # ==========================================
            # PPM Header
            # ==========================================
            f.write(
                f"P3\n"
                f"{self.image_width} "
                f"{self.image_height}\n"
                f"255\n"
            )

            pbar = tqdm(range(self.image_height))

            for j in pbar:

                # System stats every 5 rows
                if j % 5 == 0:
                    stats = system_monitor()
                    pbar.set_postfix(stats)

                for i in range(self.image_width):

                    # Start black
                    pixel_color = Vec3(0, 0, 0)

                    # ==========================================
                    # Multi-sampling
                    # ==========================================
                    for _ in range(
                        self.samples_per_pixel
                    ):

                        r = self.get_ray(i, j)

                        pixel_color += self.ray_color(
                            r,
                            world,
                            self.max_depth
                        )

                    # ==========================================
                    # STEP 1: Average samples
                    #
                    # Formula:
                    #
                    # C_avg = total / N
                    # ==========================================
                    pixel_color *= (
                        self.pixel_samples_scale
                    )

                    # ==========================================
                    # STEP 2: Gamma correction
                    #
                    # Formula:
                    #
                    # C_gamma = sqrt(C_linear)
                    #
                    # Changed from before:
                    # This did NOT exist before.
                    # ==========================================
                    pixel_color = self.gamma_correct(
                        pixel_color
                    )

                    # ==========================================
                    # STEP 3: Clamp
                    #
                    # Formula:
                    #
                    # clamp(x,0,0.999)
                    # ==========================================
                    r = min(
                        max(pixel_color.x, 0),
                        0.999
                    )

                    g = min(
                        max(pixel_color.y, 0),
                        0.999
                    )

                    b = min(
                        max(pixel_color.z, 0),
                        0.999
                    )

                    # ==========================================
                    # STEP 4: Convert to bytes
                    #
                    # Formula:
                    #
                    # byte = 256 * color
                    # ==========================================
                    ir = int(256 * r)
                    ig = int(256 * g)
                    ib = int(256 * b)

                    # Write pixel
                    f.write(
                        f"{ir} {ig} {ib}\n"
                    )

    def show(self):
        """
        Open output image
        """
        return image_viewer("output.ppm")