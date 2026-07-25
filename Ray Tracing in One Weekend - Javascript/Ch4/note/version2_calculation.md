```python
aspect_ratio = 16.0 / 9.0
image_width = 400
image_height = int(image_width / aspect_ratio)
image_height = max(1, image_height)

focal_length = 1.0
viewport_height = 2.0
viewport_width = viewport_height * (float(image_width) / image_height)

camera_center = (0.0, 0.0, 0.0)

viewport_u = (viewport_width, 0.0, 0.0)
viewport_v = (0.0, -viewport_height, 0.0)

pixel_delta_u = (viewport_u[0] / image_width, 0.0, 0.0)
pixel_delta_v = (0.0, viewport_v[1] / image_height, 0.0)

viewport_center = (0.0, 0.0, -focal_length)

# viewport_upper_left = viewport_center - viewport_u/2 - viewport_v/2
viewport_upper_left = (
    viewport_center[0] - viewport_u[0]/2,
    viewport_center[1] - viewport_v[1]/2,
    viewport_center[2]
)

# pixel00_loc = viewport_upper_left + 0.5*(pixel_delta_u + pixel_delta_v)
pixel00_loc = (
    viewport_upper_left[0] + 0.5 * pixel_delta_u[0],
    viewport_upper_left[1] + 0.5 * pixel_delta_v[1],
    viewport_upper_left[2]
)

print(f"aspect_ratio: {aspect_ratio}")
print(f"image_width: {image_width}")
print(f"image_height: {image_height}")
print(f"actual aspect ratio (image_width/image_height): {image_width / image_height}")
print(f"viewport_height: {viewport_height}")
print(f"viewport_width: {viewport_width}")
print(f"camera_center: {camera_center}")
print(f"viewport_u: {viewport_u}")
print(f"viewport_v: {viewport_v}")
print(f"pixel_delta_u: {pixel_delta_u}")
print(f"pixel_delta_v: {pixel_delta_v}")
print(f"viewport_center: {viewport_center}")
print(f"viewport_upper_left: {viewport_upper_left}")
print(f"pixel00_loc: {pixel00_loc}")


```

```text
aspect_ratio: 1.7777777777777777
image_width: 400
image_height: 225
actual aspect ratio (image_width/image_height): 1.7777777777777777
viewport_height: 2.0
viewport_width: 3.5555555555555554
camera_center: (0.0, 0.0, 0.0)
viewport_u: (3.5555555555555554, 0.0, 0.0)
viewport_v: (0.0, -2.0, 0.0)
pixel_delta_u: (0.008888888888888889, 0.0, 0.0)
pixel_delta_v: (0.0, -0.008888888888888889, 0.0)
viewport_center: (0.0, 0.0, -1.0)
viewport_upper_left: (-1.7777777777777777, 1.0, -1.0)
pixel00_loc: (-1.7733333333333332, 0.9955555555555555, -1.0)


```

```python
from fractions import Fraction

aspect_ratio = Fraction(16, 9)
image_width = 400
image_height = int(image_width / aspect_ratio)

viewport_height = Fraction(2, 1)
viewport_width = viewport_height * Fraction(image_width, image_height)

viewport_u_x = viewport_width
viewport_v_y = -viewport_height

pixel_delta_u_x = viewport_u_x / image_width
pixel_delta_v_y = viewport_v_y / image_height

viewport_ul_x = -viewport_u_x / 2
viewport_ul_y = -viewport_v_y / 2
viewport_ul_z = Fraction(-1, 1)

pixel00_x = viewport_ul_x + Fraction(1, 2) * pixel_delta_u_x
pixel00_y = viewport_ul_y + Fraction(1, 2) * pixel_delta_v_y
pixel00_z = Fraction(-1, 1)

print(f"image_height: {image_height}")
print(f"viewport_width: {viewport_width} = {float(viewport_width)}")
print(f"pixel_delta_u_x: {pixel_delta_u_x} = {float(pixel_delta_u_x)}")
print(f"pixel_delta_v_y: {pixel_delta_v_y} = {float(pixel_delta_v_y)}")
print(f"viewport_upper_left: ({viewport_ul_x}, {viewport_ul_y}, {viewport_ul_z}) = ({float(viewport_ul_x)}, {float(viewport_ul_y)}, {float(viewport_ul_z)})")
print(f"pixel00_loc: ({pixel00_x}, {pixel00_y}, {pixel00_z}) = ({float(pixel00_x)}, {float(pixel00_y)}, {float(pixel00_z)})")


```

```text
image_height: 225
viewport_width: 32/9 = 3.5555555555555554
pixel_delta_u_x: 2/225 = 0.008888888888888889
pixel_delta_v_y: -2/225 = -0.008888888888888889
viewport_upper_left: (-16/9, 1, -1) = (-1.7777777777777777, 1.0, -1.0)
pixel00_loc: (-133/75, 224/225, -1) = (-1.7733333333333334, 0.9955555555555555, -1.0)


```

Here are the calculated values step-by-step using both **exact fractions** and **decimal approximations**:

---

## 1. Primary Dimensions

| Parameter | Formula / Calculation | Exact Fraction | Decimal Approximation |
| --- | --- | --- | --- |
| **`image_height`** | $\lfloor 400 / (16/9) \rfloor$ | $225$ | **$225$** |
| **`viewport_width`** | $2.0 \times \left(\frac{400}{225}\right)$ | $\frac{32}{9}$ | **$\approx 3.55556$** |
| **`camera_center`** | Provided | $(0,\ 0,\ 0)$ | **$(0.0,\ 0.0,\ 0.0)$** |

---

## 2. Viewport Edge Vectors

| Vector | Formula | Exact Vector | Decimal Vector |
| --- | --- | --- | --- |
| **`viewport_u`** | $(\text{viewport\_width},\ 0,\ 0)$ | $\left(\frac{32}{9},\ 0,\ 0\right)$ | **$(3.55556,\ 0.0,\ 0.0)$** |
| **`viewport_v`** | $(0,\ -\text{viewport\_height},\ 0)$ | $(0,\ -2,\ 0)$ | **$(0.0,\ -2.0,\ 0.0)$** |

---

## 3. Pixel Spacing (Delta Vectors)

| Vector | Formula | Exact Vector | Decimal Vector |
| --- | --- | --- | --- |
| **`pixel_delta_u`** | $\frac{\text{viewport\_u}}{400}$ | $\left(\frac{2}{225},\ 0,\ 0\right)$ | **$(0.00889,\ 0.0,\ 0.0)$** |
| **`pixel_delta_v`** | $\frac{\text{viewport\_v}}{225}$ | $\left(0,\ -\frac{2}{225},\ 0\right)$ | **$(0.0,\ -0.00889,\ 0.0)$** |

---

## 4. Key Spatial Locations

| Point | Formula | Exact Position | Decimal Position |
| --- | --- | --- | --- |
| **`viewport_center`** | $\text{camera\_center} - (0, 0, 1.0)$ | $(0,\ 0,\ -1)$ | **$(0.0,\ 0.0,\ -1.0)$** |
| **`viewport_upper_left`** | $\text{center} - \frac{\text{viewport\_u}}{2} - \frac{\text{viewport\_v}}{2}$ | $\left(-\frac{16}{9},\ 1,\ -1\right)$ | **$(-1.77778,\ 1.0,\ -1.0)$** |
| **`pixel00_loc`** | $\text{upper\_left} + 0.5 \times (\Delta u + \Delta v)$ | $\left(-\frac{133}{75},\ \frac{224}{225},\ -1\right)$ | **$(-1.77333,\ 0.99556,\ -1.0)$** |