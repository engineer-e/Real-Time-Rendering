# Ray Tracing Camera Setup & Orthonormal Basis Derivation

---

## 1. Camera Initialization Algorithm

### Inputs

* `image_width`, `image_height`: Output image resolution in pixels
* `focal_length`: Distance to virtual image plane *(default: `1.0`)*
* `viewport_height`: Physical screen height in world units *(default: `2.0`)*

---

### Algorithm Steps

1. **Define Camera Position**
   * `camera_center` $= (0, 0, 0)$

2. **Determine Viewport Dimensions**
   * `aspect_ratio` $= \frac{\text{image\_width}}{\text{image\_height}}$
   * `viewport_width` $= \text{viewport\_height} \times \text{aspect\_ratio}$

3. **Define Viewport Edge Vectors**
   * $\vec{u}_{\text{viewport}} = (\text{viewport\_width},\ 0,\ 0)$
   * $\vec{v}_{\text{viewport}} = (0,\ -\text{viewport\_height},\ 0)$

4. **Compute Per-Pixel Step Vectors**
   * $\Delta\vec{u}_{\text{pixel}} = \frac{\vec{u}_{\text{viewport}}}{\text{image\_width}}$
   * $\Delta\vec{v}_{\text{pixel}} = \frac{\vec{v}_{\text{viewport}}}{\text{image\_height}}$

5. **Position Viewport Boundaries**
   * `viewport_center` $= \text{camera\_center} - (0,\ 0,\ \text{focal\_length})$
   * `viewport_upper_left` $= \text{viewport\_center} - \frac{\vec{u}_{\text{viewport}}}{2} - \frac{\vec{v}_{\text{viewport}}}{2}$

6. **Locate Center of Pixel $(0, 0)$**
   * `pixel00_loc` $= \text{viewport\_upper\_left} + 0.5 \times (\Delta\vec{u}_{\text{pixel}} + \Delta\vec{v}_{\text{pixel}})$

---

### Pixel Location Formula

For any pixel coordinate $(i, j)$:

$$\text{pixel\_center}(i, j) = \text{pixel00\_loc} + (i \cdot \Delta\vec{u}_{\text{pixel}}) + (j \cdot \Delta\vec{v}_{\text{pixel}})$$

---

## 2. Mathematical Proof: Simple Camera from General ONB

Evaluating general Orthonormal Basis (ONB) formulas for a camera at the origin looking down $-Z$:

* **Camera Position ($\mathbf{E}$):** $(0, 0, 0)$
* **Target Point ($\mathbf{T}$):** $(0, 0, -1)$
* **World Up Vector ($\vec{v}_{\text{up}}$):** $(0, 1, 0)$

---

### Proof Steps

1. **Local $Z$-axis ($\vec{w}$):**
   $$\vec{w} = \frac{\mathbf{E} - \mathbf{T}}{\|\mathbf{E} - \mathbf{T}\|} = \frac{(0, 0, 1)}{1} = (0, 0, 1)$$

2. **Local $X$-axis ($\vec{u}$):**
   $$\vec{u} = \frac{\vec{v}_{\text{up}} \times \vec{w}}{\|\vec{v}_{\text{up}} \times \vec{w}\|} = \frac{(1, 0, 0)}{1} = (1, 0, 0)$$

3. **Local $Y$-axis ($\vec{v}$):**
   $$\vec{v} = \vec{w} \times \vec{u} = (0, 0, 1) \times (1, 0, 0) = (0, 1, 0)$$

4. **Scaled Viewport Vectors:**
   * $\vec{u}_{\text{viewport}} = \text{viewport\_width} \cdot \vec{u} = (\text{viewport\_width},\ 0,\ 0)$
   * $\vec{v}_{\text{viewport}} = -\text{viewport\_height} \cdot \vec{v} = (0,\ -\text{viewport\_height},\ 0)$

$$\blacksquare$$

---

## 3. Related Resources

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)

* **Video Tutorial:** [How to Make a Basis Orthonormal (YouTube)](http://www.youtube.com/watch?v=ZlQHxWjAT8E)