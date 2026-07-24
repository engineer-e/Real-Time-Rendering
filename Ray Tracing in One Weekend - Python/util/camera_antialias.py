from util.ray import Ray
from util.vec3 import Vec3, unit_vector
from util.hit_record import HitRecord
from util.interval import Interval
from util.image_viewer import image_viewer
from util.utility import random_double, random_double_range, INFINITY
from tqdm import tqdm



class Camera:
    """
    Camera class handles:

    1. Image plane setup
    2. Ray generation
    3. Anti-aliasing
    4. Rendering
    """

    # -----------------------------------
    # USER SETTINGS
    # -----------------------------------
    def __init__(self):
        self.aspect_ratio = 16 / 9
        self.image_width = 400
        self.samples_per_pixel = 100   # Anti-aliasing samples

    # -----------------------------------
    # MAIN RENDER FUNCTION
    # -----------------------------------
    def render(self, world):
        """
        Render the whole scene.

        Anti-aliasing:
        For each pixel:
        C = (1/N) * Σ C_i
        """

        # Prepare camera
        self.initialize()

        with open("output.ppm", "w") as f:

            # Write PPM header
            f.write(
                f"P3\n{self.image_width} {self.image_height}\n255\n"
            )

            # Scan image rows
            for j in tqdm(range(self.image_height), desc="Rendering"):

                # Scan columns
                for i in range(self.image_width):

                    # Accumulate all sample colors
                    pixel_color = Vec3(0, 0, 0)

                    # Multi-sampling loop
                    for sample in range(self.samples_per_pixel):

                        # Generate random ray inside pixel
                        r = self.get_ray(i, j)

                        # Add sample color
                        pixel_color += self.ray_color(r, world)

                    # Average all samples
                    pixel_color = (
                        self.pixel_samples_scale * pixel_color
                    )

                    # Clamp color values to safe range
                    intensity = Interval(0.000, 0.999)

                    ir = int(
                        256 * intensity.clamp(pixel_color.x)
                    )
                    ig = int(
                        256 * intensity.clamp(pixel_color.y)
                    )
                    ib = int(
                        256 * intensity.clamp(pixel_color.z)
                    )

                    # Write final pixel
                    f.write(f"{ir} {ig} {ib}\n")

        print("Done!")

    # -----------------------------------
    # CAMERA SETUP
    # -----------------------------------
    def initialize(self):
        """
        Compute camera geometry.

        Also precompute sample scaling:
        scale = 1 / samples_per_pixel
        """

        # Compute image height
        self.image_height = int(
            self.image_width / self.aspect_ratio
        )

        if self.image_height < 1:
            self.image_height = 1

        # Scale factor for averaging samples
        self.pixel_samples_scale = (
            1.0 / self.samples_per_pixel
        )

        # Camera center
        self.center = Vec3(0, 0, 0)

        # Viewport settings
        focal_length = 1.0
        viewport_height = 2.0
        viewport_width = (
            viewport_height *
            (self.image_width / self.image_height)
        )

        # Horizontal viewport edge
        viewport_u = Vec3(viewport_width, 0, 0)

        # Vertical viewport edge
        viewport_v = Vec3(0, -viewport_height, 0)

        # Pixel step vectors
        self.pixel_delta_u = (
            viewport_u / self.image_width
        )

        self.pixel_delta_v = (
            viewport_v / self.image_height
        )

        # Top-left viewport corner
        viewport_upper_left = (
            self.center
            - Vec3(0, 0, focal_length)
            - viewport_u / 2
            - viewport_v / 2
        )

        # Center of first pixel
        self.pixel00_loc = (
            viewport_upper_left
            + 0.5 * (
                self.pixel_delta_u +
                self.pixel_delta_v
            )
        )

    # -----------------------------------
    # RANDOM SUBPIXEL SAMPLE
    # -----------------------------------
    def sample_square(self):
        """
        Returns random point inside unit square.

        Range:
        [-0.5,+0.5)

        Formula:
        offset = random() - 0.5
        """

        return Vec3(
            random_double() - 0.5,
            random_double() - 0.5,
            0
        )

    # -----------------------------------
    # BUILD CAMERA RAY
    # -----------------------------------
    def get_ray(self, i, j):
        """
        Create ray through random point inside pixel.

        Formula:
        P = P00 + (i+dx)Δu + (j+dy)Δv

        where:
        dx,dy ∈ [-0.5,+0.5)
        """

        # Random offset inside pixel
        offset = self.sample_square()

        # Random sampled pixel location
        pixel_sample = (
            self.pixel00_loc
            + self.pixel_delta_u * (i + offset.x)
            + self.pixel_delta_v * (j + offset.y)
        )

        # Ray direction
        ray_direction = pixel_sample - self.center

        return Ray(self.center, ray_direction)

    # -----------------------------------
    # RAY COLOR
    # -----------------------------------
    def ray_color(self, r, world):
        """
        Returns ray color.

        If hit:
        visualize surface normal

        Else:
        sky gradient
        """

        rec = HitRecord()

        # Hit object
        if world.hit(r, Interval(0.001, INFINITY), rec):

            # Convert normal from [-1,1] → [0,1]
            return 0.5 * (rec.normal + Vec3(1, 1, 1))

        # Background gradient
        unit_dir = unit_vector(r.direction())

        t = 0.5 * (unit_dir.y + 1.0)

        white = Vec3(1, 1, 1)
        blue = Vec3(0.5, 0.7, 1.0)

        return white * (1 - t) + blue * t

    # -----------------------------------
    # SHOW IMAGE
    # -----------------------------------
    def show(self):
        """
        Display output image
        """
        return image_viewer("output.ppm")