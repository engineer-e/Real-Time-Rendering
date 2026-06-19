import math
import random
import os
import concurrent.futures

from tqdm import tqdm

from util.week1.vec3 import Vec3, unit_vector, cross
from util.week1.ray import Ray
from util.week1.hitrecord import HitRecord
from util.week1.interval import Interval
from util.week1.image_viewer import image_viewer
from util.week1.system_monitor import system_monitor


class Camera:

    def __init__(self):

        # =====================================================
        # IMAGE SETTINGS
        # =====================================================
        self.aspect_ratio = 16 / 9
        self.image_width = 400
        self.samples_per_pixel = 100
        self.max_depth = 50

        # =====================================================
        # CAMERA SETTINGS
        # =====================================================
        self.vfov = 90

        self.lookfrom = Vec3(0, 0, 0)
        self.lookat = Vec3(0, 0, -1)
        self.vup = Vec3(0, 1, 0)

        # =====================================================
        # DEFOCUS BLUR SETTINGS
        #
        # PURPOSE:
        # Simulate camera lens aperture
        #
        # Formula:
        #
        # radius = focus_dist * tan(theta/2)
        # =====================================================
        self.defocus_angle = 0.0
        self.focus_dist = 1.0

        # =====================================================
        # MOTION BLUR SETTINGS (NEW)
        #
        # PURPOSE:
        # Camera shutter open/close interval
        #
        # Formula:
        #
        # τ ~ U(time0, time1)
        # =====================================================
        self.time0 = 0.0   # shutter open
        self.time1 = 1.0   # shutter close

        self.output_file = "output.ppm"

    # =====================================================
    # INITIALIZE CAMERA
    #
    # PURPOSE:
    # Build viewport and camera basis vectors
    #
    # Basis:
    #
    # w = normalize(lookfrom - lookat)
    # u = normalize(vup × w)
    # v = w × u
    # =====================================================
    def initialize(self):

        # image height from aspect ratio
        self.image_height = max(
            1,
            int(self.image_width / self.aspect_ratio)
        )

        # average samples
        self.pixel_samples_scale = 1.0 / self.samples_per_pixel

        # camera center
        self.center = self.lookfrom

        # ==========================================
        # CAMERA BASIS
        # ==========================================
        w = unit_vector(self.lookfrom - self.lookat)
        u = unit_vector(cross(self.vup, w))
        v = cross(w, u)

        self.u = u
        self.v = v
        self.w = w

        # ==========================================
        # FIELD OF VIEW
        #
        # Formula:
        #
        # h = tan(vfov/2)
        # viewport_height = 2h
        # ==========================================
        theta = math.radians(self.vfov)
        h = math.tan(theta / 2)

        viewport_height = 2 * h * self.focus_dist
        viewport_width = viewport_height * (
            self.image_width / self.image_height
        )

        # viewport axes
        viewport_u = viewport_width * u
        viewport_v = viewport_height * (-v)

        # per-pixel spacing
        self.pixel_delta_u = viewport_u / self.image_width
        self.pixel_delta_v = viewport_v / self.image_height

        # upper-left pixel
        viewport_upper_left = (
            self.center
            - self.focus_dist * w
            - viewport_u / 2
            - viewport_v / 2
        )

        self.pixel00_loc = (
            viewport_upper_left
            + 0.5 * (
                self.pixel_delta_u
                + self.pixel_delta_v
            )
        )

        # ==========================================
        # DEFOCUS DISK
        #
        # Lens radius formula:
        #
        # r = focus_dist * tan(defocus_angle/2)
        # ==========================================
        defocus_radius = self.focus_dist * math.tan(
            math.radians(self.defocus_angle / 2)
        )

        self.defocus_disk_u = u * defocus_radius
        self.defocus_disk_v = v * defocus_radius

    # =====================================================
    # RANDOM POINT INSIDE UNIT DISK
    #
    # PURPOSE:
    # Used for lens sampling
    # =====================================================
    def random_in_unit_disk(self):

        while True:

            p = Vec3(
                random.random() * 2 - 1,
                random.random() * 2 - 1,
                0
            )

            if p.x * p.x + p.y * p.y < 1:
                return p

    # =====================================================
    # RANDOM PIXEL JITTER
    #
    # PURPOSE:
    # Anti-aliasing
    # =====================================================
    def sample_square(self):

        return Vec3(
            random.random() - 0.5,
            random.random() - 0.5,
            0
        )

    # =====================================================
    # GENERATE RAY
    #
    # Combines:
    # 1. Anti-aliasing
    # 2. Defocus blur
    # 3. Motion blur
    # =====================================================
    def get_ray(self, i, j):

        # ==========================================
        # 1. Pixel jitter
        # ==========================================
        offset = self.sample_square()

        pixel_sample = (
            self.pixel00_loc
            + (i + offset.x) * self.pixel_delta_u
            + (j + offset.y) * self.pixel_delta_v
        )

        # ==========================================
        # 2. Defocus blur origin
        # ==========================================
        if self.defocus_angle <= 0:

            ray_origin = self.center

        else:

            p = self.random_in_unit_disk()

            ray_origin = (
                self.center
                + p.x * self.defocus_disk_u
                + p.y * self.defocus_disk_v
            )

        # ==========================================
        # 3. Direction
        # ==========================================
        ray_direction = pixel_sample - ray_origin

        # ==========================================
        # 4. Motion blur time sample
        #
        # Formula:
        #
        # τ ~ U(time0, time1)
        # ==========================================
        ray_time = random.uniform(
            self.time0,
            self.time1
        )

        # OLD:
        # return Ray(origin, direction)

        # NEW:
        # return Ray(origin, direction, time)
        return Ray(
            ray_origin,
            ray_direction,
            ray_time
        )

    # =====================================================
    # PATH TRACING
    # =====================================================
    def ray_color(self, ray, world, depth):

        if depth <= 0:
            return Vec3(0, 0, 0)

        rec = HitRecord()

        hit = world.hit(
            ray,
            Interval(0.001, float("inf")),
            rec
        )

        if hit:

            scattered, attenuation = rec.mat.scatter(
                ray,
                rec
            )

            return attenuation * self.ray_color(
                scattered,
                world,
                depth - 1
            )

        # sky gradient
        unit_dir = unit_vector(ray.direction())
        t = 0.5 * (unit_dir.y + 1.0)

        return (
            (1 - t) * Vec3(1, 1, 1)
            + t * Vec3(0.5, 0.7, 1.0)
        )

    # =====================================================
    # GAMMA CORRECTION
    #
    # Formula:
    #
    # corrected = sqrt(color)
    # =====================================================
    def gamma(self, c):

        return Vec3(
            math.sqrt(c.x),
            math.sqrt(c.y),
            math.sqrt(c.z)
        )

    # =====================================================
    # SHOW IMAGE
    # =====================================================
    def show(self):

        if not os.path.exists(self.output_file):
            raise FileNotFoundError(
                "Run render() first."
            )

        return image_viewer(self.output_file)

    # =====================================================
    # RENDER
    # =====================================================
    def render(self, world):

        self.initialize()

        def render_row(j_row):

            row_pixels = []

            for i in range(self.image_width):

                pixel_color = Vec3(0, 0, 0)

                for _ in range(self.samples_per_pixel):

                    ray = self.get_ray(i, j_row)

                    pixel_color += self.ray_color(
                        ray,
                        world,
                        self.max_depth
                    )

                pixel_color *= self.pixel_samples_scale
                pixel_color = self.gamma(pixel_color)

                r = min(max(pixel_color.x, 0), 0.999)
                g = min(max(pixel_color.y, 0), 0.999)
                b = min(max(pixel_color.z, 0), 0.999)

                row_pixels.append(
                    f"{int(256*r)} {int(256*g)} {int(256*b)}"
                )

            return "\n".join(row_pixels)

        with open(self.output_file, "w") as f:

            f.write("P3\n")
            f.write(
                f"{self.image_width} {self.image_height}\n"
            )
            f.write("255\n")

            with concurrent.futures.ThreadPoolExecutor() as executor:

                results = list(
                    tqdm(
                        executor.map(
                            render_row,
                            range(self.image_height)
                        ),
                        total=self.image_height,
                        desc="Rendering",
                        postfix=system_monitor()
                    )
                )

                for row_data in results:
                    f.write(row_data + "\n")

        print(f"Render complete → {self.output_file}")

