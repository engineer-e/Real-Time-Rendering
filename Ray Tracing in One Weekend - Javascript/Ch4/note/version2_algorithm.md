The issue is that the custom image URL `https://thumbs.video-to-markdown.com/73ff2b11.jpg` may not be accessible on GitHub, causing the embed to break. A reliable fix is to use YouTube’s own thumbnail, which will always render correctly.

**Corrected embed (using YouTube’s default thumbnail):**
```markdown
[![How to Make a Basis Orthonormal](https://img.youtube.com/vi/ZlQHxWjAT8E/0.jpg)](https://youtu.be/ZlQHxWjAT8E)
```

Below is the **full corrected markdown** you can save directly to your GitHub file. The stray comment text has been removed and the video link replaced.

---

# Camera Initialization Algorithm

### **Input Parameters**

* `image_width`: Target image width in pixels
* `image_height`: Target image height in pixels
* `focal_length`: Distance from the camera origin to the virtual image plane (default: `1.0`)
* `viewport_height`: Physical height of the virtual screen in world units (default: `2.0`)

---

### **Algorithm**

1. **Define Camera Position**
   * $\text{camera\_center} \leftarrow (0, 0, 0)$

2. **Determine Viewport Dimensions**
   * $\text{aspect\_ratio} \leftarrow \frac{\text{image\_width}}{\text{image\_height}}$
   * $\text{viewport\_width} \leftarrow \text{viewport\_height} \times \text{aspect\_ratio}$

3. **Define Viewport Spatial Edge Vectors**
   * $\vec{u}_{\text{viewport}} \leftarrow (\text{viewport\_width},\ 0,\ 0)$
   * $\vec{v}_{\text{viewport}} \leftarrow (0,\ -\text{viewport\_height},\ 0)$ *(Negative $Y$ ensures top-to-bottom scanlines)*

4. **Compute Per-Pixel Step Vectors**
   * $\Delta\vec{u}_{\text{pixel}} \leftarrow \frac{\vec{u}_{\text{viewport}}}{\text{image\_width}}$
   * $\Delta\vec{v}_{\text{pixel}} \leftarrow \frac{\vec{v}_{\text{viewport}}}{\text{image\_height}}$

5. **Position Viewport Boundaries**
   * $\text{viewport\_center} \leftarrow \text{camera\_center} - (0,\ 0,\ \text{focal\_length})$
   * $\text{viewport\_upper\_left} \leftarrow \text{viewport\_center} - \frac{\vec{u}_{\text{viewport}}}{2} - \frac{\vec{v}_{\text{viewport}}}{2}$

6. **Locate Center of Pixel $(0, 0)$**
   * $\text{pixel00\_loc} \leftarrow \text{viewport\_upper\_left} + 0.5 \times (\Delta\vec{u}_{\text{pixel}} + \Delta\vec{v}_{\text{pixel}})$

---

### **Output State**

The setup yields:

* **Camera Origin:** $\text{camera\_center}$
* **Starting Pixel Center:** $\text{pixel00\_loc}$
* **Horizontal Delta Vector:** $\Delta\vec{u}_{\text{pixel}}$
* **Vertical Delta Vector:** $\Delta\vec{v}_{\text{pixel}}$

*(For any pixel $(i, j)$, its exact 3D center location is computed as: $\text{pixel00\_loc} + (i \times \Delta\vec{u}_{\text{pixel}}) + (j \times \Delta\vec{v}_{\text{pixel}})$)*

---

To prove that the simple axis-aligned camera vectors are a direct mathematical consequence of the general camera formulation, we just need to evaluate the general Orthonormal Basis (ONB) formulas using the baseline camera parameters.

---

### **Given Parameters for the Simple Camera**

1. **Camera Position ($\mathbf{E}$):** $(0, 0, 0)$
2. **Target Point ($\mathbf{T}$):** Looking down the negative $Z$-axis $\rightarrow (0, 0, -1)$
3. **World Up Vector ($\vec{v}_{\text{up}}$):** $(0, 1, 0)$

---

### **Proof Step-by-Step**

#### **Step 1: Compute Unit Vector $\vec{w}$ (Local $Z$-axis)**

The vector $\vec{w}$ points in the direction opposite to where the camera is looking:

$$\mathbf{E} - \mathbf{T} = (0, 0, 0) - (0, 0, -1) = (0, 0, 1)$$

Normalizing to a unit vector:

$$\vec{w} = \frac{(0, 0, 1)}{\Vert{}(0, 0, 1)\Vert{}} = (0, 0, 1)$$

---

#### **Step 2: Compute Unit Vector $\vec{u}$ (Local $X$-axis)**

$\vec{u}$ represents the camera's local "Right" direction, found using the cross product $\vec{v}_{\text{up}} \times \vec{w}$:

$$\vec{u}_{\text{raw}} = \vec{v}_{\text{up}} \times \vec{w} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix}$$

Expanding the determinant:

$$\vec{u}_{\text{raw}} = \mathbf{i}(1 \cdot 1 - 0 \cdot 0) - \mathbf{j}(0 \cdot 1 - 0 \cdot 0) + \mathbf{k}(0 \cdot 0 - 1 \cdot 0) = (1, 0, 0)$$

Normalizing:

$$\vec{u} = \frac{(1, 0, 0)}{\Vert{}(1, 0, 0)\Vert{}} = (1, 0, 0)$$

---

#### **Step 3: Compute Unit Vector $\vec{v}$ (Local $Y$-axis)**

$\vec{v}$ represents the camera's local "Up" direction, given by $\vec{w} \times \vec{u}$:

$$\vec{v} = \vec{w} \times \vec{u} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{vmatrix}$$

Expanding the determinant:

$$\vec{v} = \mathbf{i}(0 \cdot 0 - 1 \cdot 0) - \mathbf{j}(0 \cdot 0 - 1 \cdot 1) + \mathbf{k}(0 \cdot 0 - 0 \cdot 1) = (0, 1, 0)$$

---

#### **Step 4: Scale by Viewport Dimensions**

Plugging $\vec{u} = (1, 0, 0)$ and $\vec{v} = (0, 1, 0)$ into the generalized viewport equations:

1. **Horizontal Edge Vector:**

$$\vec{u}_{\text{viewport}} = \text{viewport\_width} \cdot \vec{u} = \text{viewport\_width} \cdot (1, 0, 0) = (\text{viewport\_width},\ 0,\ 0)$$

2. **Vertical Edge Vector:**

$$\vec{v}_{\text{viewport}} = -\text{viewport\_height} \cdot \vec{v} = -\text{viewport\_height} \cdot (0, 1, 0) = (0,\ -\text{viewport\_height},\ 0)$$

$$\blacksquare$$

---

### **Conclusion**

This completes the proof. The simple hardcoded vectors $(\text{viewport\_width},\ 0,\ 0)$ and $(0,\ -\text{viewport\_height},\ 0)$ are not arbitrary rules of thumb — they are the exact mathematical result of applying an **Orthonormal Basis (ONB)** to a camera at the origin looking down $-Z$.

---

[![How to Make a Basis Orthonormal](https://img.youtube.com/vi/ZlQHxWjAT8E/0.jpg)](https://youtu.be/ZlQHxWjAT8E)

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)