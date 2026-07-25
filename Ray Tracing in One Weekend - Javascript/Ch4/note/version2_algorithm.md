# Ray Tracing Camera Setup & Orthonormal Basis Derivation

---

## 1. Camera Initialization Algorithm

### Input Parameters

* `image_width`: Target image width in pixels
* `image_height`: Target image height in pixels
* `focal_length`: Distance from camera origin to virtual image plane *(default: `1.0`)*
* `viewport_height`: Physical height of virtual screen in world units *(default: `2.0`)*

---

### Algorithm Steps

1. **Define Camera Position**
   * `camera_center` $\leftarrow (0, 0, 0)$

2. **Determine Viewport Dimensions**
   * `aspect_ratio` $\leftarrow$ `image_width` / `image_height`
   * `viewport_width` $\leftarrow$ `viewport_height` $\times$ `aspect_ratio`

3. **Define Viewport Edge Vectors**
   * $\vec{u}_{\text{viewport}} \leftarrow$ (`viewport_width`, $0$, $0$)
   * $\vec{v}_{\text{viewport}} \leftarrow$ ($0$, $-\text{viewport\_height}$, $0$)

4. **Compute Per-Pixel Step Vectors**
   * $\Delta\vec{u}_{\text{pixel}} \leftarrow \vec{u}_{\text{viewport}}$ / `image_width`
   * $\Delta\vec{v}_{\text{pixel}} \leftarrow \vec{v}_{\text{viewport}}$ / `image_height`

5. **Position Viewport Boundaries**
   * `viewport_center` $\leftarrow$ `camera_center` $- (0, 0,$ `focal_length`$)$
   * `viewport_upper_left` $\leftarrow$ `viewport_center` $- (\vec{u}_{\text{viewport}} / 2) - (\vec{v}_{\text{viewport}} / 2)$

6. **Locate Center of Pixel $(0, 0)$**
   * `pixel00_loc` $\leftarrow$ `viewport_upper_left` $+ 0.5 \times (\Delta\vec{u}_{\text{pixel}} + \Delta\vec{v}_{\text{pixel}})$

---

### Pixel Location Formula

For any pixel coordinate $(i, j)$:

$$\text{pixel\_center}(i, j) = \text{pixel00\_loc} + (i \cdot \Delta\vec{u}_{\text{pixel}}) + (j \cdot \Delta\vec{v}_{\text{pixel}})$$