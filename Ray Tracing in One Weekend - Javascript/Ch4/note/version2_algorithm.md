Here is the clean, structured algorithm based on the camera initialization steps:

---

## Camera Initialization Algorithm

### **Input Parameters**

* `image_width`: Target image width in pixels
* `image_height`: Target image height in pixels
* `focal_length`: Distance from the camera origin to the virtual image plane (default: `1.0`)
* `viewport_height`: Physical height of the virtual screen in world units (default: `2.0`)

---

### **Algorithm**

1. **Define Camera Position**

* $\mathbf{camera\_center} \leftarrow (0, 0, 0)$


2. **Determine Viewport Dimensions**

* $\mathbf{aspect\_ratio} \leftarrow \frac{\mathbf{image\_width}}{\mathbf{image\_height}}$

* $\mathbf{viewport\_width} \leftarrow \mathbf{viewport\_height} \times \mathbf{aspect\_ratio}$


3. **Define Viewport Spatial Edge Vectors**

* $\vec{u}_{\mathbf{viewport}} \leftarrow (\mathbf{viewport\_width},\ 0,\ 0)$

* $\vec{v}_{\mathbf{viewport}} \leftarrow (0,\ -\mathbf{viewport\_height},\ 0)$ *(Negative $Y$ ensures top-to-bottom scanlines)*


4. **Compute Per-Pixel Step Vectors**

* $\Delta\vec{u}_{\mathbf{pixel}} \leftarrow \frac{\vec{u}_{\mathbf{viewport}}}{\mathbf{image\_width}}$

* $\Delta\vec{v}_{\mathbf{pixel}} \leftarrow \frac{\vec{v}_{\mathbf{viewport}}}{\mathbf{image\_height}}$


5. **Position Viewport Boundaries**

* $\mathbf{viewport\_center} \leftarrow \mathbf{camera\_center} - (0,\ 0,\ \mathbf{focal\_length})$

* $\mathbf{viewport\_upper\_left} \leftarrow \mathbf{viewport\_center} - \frac{\vec{u}_{\mathbf{viewport}}}{2} - \frac{\vec{v}_{\mathbf{viewport}}}{2}$


6. **Locate Center of Pixel $(0, 0)$**

* $\mathbf{pixel00\_loc} \leftarrow \mathbf{viewport\_upper\_left} + 0.5 \times (\Delta\vec{u}_{\mathbf{pixel}} + \Delta\vec{v}_{\mathbf{pixel}})$



---

### **Output State**

The setup yields:

* **Camera Origin:** $\mathbf{camera\_center}$

* **Starting Pixel Center:** $\mathbf{pixel00\_loc}$

* **Horizontal Delta Vector:** $\Delta\vec{u}_{\mathbf{pixel}}$

* **Vertical Delta Vector:** $\Delta\vec{v}_{\mathbf{pixel}}$

*(For any pixel $(i, j)$, its exact 3D center location is computed as: $\mathbf{pixel00\_loc} + (i \times \Delta\vec{u}_{\mathbf{pixel}}) + (j \times \Delta\vec{v}_{\mathbf{pixel}})$)*


---

To prove that the simple axis-aligned camera vectors are a direct mathematical consequence of the general camera formulation, we just need to evaluate the general Orthonormal Basis (ONB) formulas using the baseline camera parameters.

---

### **Given Parameters for the Simple Camera**

1. **Camera Position ($\mathbf{E}$):** $(0, 0, 0)$
2. **Target Point ($\mathbf{T}$):** Looking down the negative $Z$-axis $\rightarrow (0, 0, -1)$
3. **World Up Vector ($\vec{v}_{\mathbf{up}}$):** $(0, 1, 0)$

---

### **Proof Step-by-Step**

#### **Step 1: Compute Unit Vector $\vec{w}$ (Local $Z$-axis)**

The vector $\vec{w}$ points in the direction opposite to where the camera is looking:

$$\mathbf{E} - \mathbf{T} = (0, 0, 0) - (0, 0, -1) = (0, 0, 1)$$

Normalizing to a unit vector:


$$\vec{w} = \frac{(0, 0, 1)}{\Vert{}(0, 0, 1)\Vert{}} = (0, 0, 1)$$

---

#### **Step 2: Compute Unit Vector $\vec{u}$ (Local $X$-axis)**

$\vec{u}$ represents the camera's local "Right" direction, found using the cross product $\vec{v}_{\mathbf{up}} \times \vec{w}$:

$$\vec{u}_{\mathbf{raw}} = \vec{v}_{\mathbf{up}} \times \vec{w} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix}$$

Expanding the determinant:


$$\vec{u}_{\mathbf{raw}} = \mathbf{i}(1 \cdot 1 - 0 \cdot 0) - \mathbf{j}(0 \cdot 1 - 0 \cdot 0) + \mathbf{k}(0 \cdot 0 - 1 \cdot 0) = (1, 0, 0)$$

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

$$\vec{u}_{\mathbf{viewport}} = \mathbf{viewport\_width} \cdot \vec{u} = \mathbf{viewport\_width} \cdot (1, 0, 0) = (\mathbf{viewport\_width},\ 0,\ 0)$$


2. **Vertical Edge Vector:**

$$\vec{v}_{\mathbf{viewport}} = -\mathbf{viewport\_height} \cdot \vec{v} = -\mathbf{viewport\_height} \cdot (0, 1, 0) = (0,\ -\mathbf{viewport\_height},\ 0)$$



$$\blacksquare$$

---

### **Conclusion**

This completes the proof. The simple hardcoded vectors $(\mathbf{viewport\_width},\ 0,\ 0)$ and $(0,\ -\mathbf{viewport\_height},\ 0)$ are not arbitrary rules of thumb — they are the exact mathematical result of applying an **Orthonormal Basis (ONB)** to a camera at the origin looking down $-Z$.

---

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)