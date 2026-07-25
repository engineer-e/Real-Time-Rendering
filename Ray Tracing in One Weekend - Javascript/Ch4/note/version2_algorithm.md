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

| Step | Operation | Formula |
| :--- | :--- | :--- |
| **1** | **Define Camera Position** | $\mathrm{camera\_center} \leftarrow (0, 0, 0)$ |
| **2** | **Determine Viewport Dimensions** | $\mathrm{aspect\_ratio} \leftarrow \frac{\mathrm{image\_width}}{\mathrm{image\_height}}$ <br> $\mathrm{viewport\_width} \leftarrow \mathrm{viewport\_height} \times \mathrm{aspect\_ratio}$ |
| **3** | **Define Viewport Edge Vectors** | $\vec{u}_{\mathrm{viewport}} \leftarrow (\mathrm{viewport\_width},\ 0,\ 0)$ <br> $\vec{v}_{\mathrm{viewport}} \leftarrow (0,\ -\mathrm{viewport\_height},\ 0)$ |
| **4** | **Compute Per-Pixel Step Vectors** | $\Delta\vec{u}_{\mathrm{pixel}} \leftarrow \frac{\vec{u}_{\mathrm{viewport}}}{\mathrm{image\_width}}$ <br> $\Delta\vec{v}_{\mathrm{pixel}} \leftarrow \frac{\vec{v}_{\mathrm{viewport}}}{\mathrm{image\_height}}$ |
| **5** | **Position Viewport Boundaries** | $\mathrm{viewport\_center} \leftarrow \mathrm{camera\_center} - (0,\ 0,\ \mathrm{focal\_length})$ <br> $\mathrm{viewport\_upper\_left} \leftarrow \mathrm{viewport\_center} - \frac{\vec{u}_{\mathrm{viewport}}}{2} - \frac{\vec{v}_{\mathrm{viewport}}}{2}$ |
| **6** | **Locate Center of Pixel $(0, 0)$** | $\mathrm{pixel00\_loc} \leftarrow \mathrm{viewport\_upper\_left} + 0.5 \times (\Delta\vec{u}_{\mathrm{pixel}} + \Delta\vec{v}_{\mathrm{pixel}})$ |

---

### Output State

* **Camera Origin:** $\mathrm{camera\_center}$
* **Starting Pixel Center:** $\mathrm{pixel00\_loc}$
* **Horizontal Delta Vector:** $\Delta\vec{u}_{\mathrm{pixel}}$
* **Vertical Delta Vector:** $\Delta\vec{v}_{\mathrm{pixel}}$

> **Pixel Location Formula:**  
> For any pixel at coordinate $(i, j)$, its exact 3D center location is given by:  
> $\mathrm{pixel\_center}(i, j) = \mathrm{pixel00\_loc} + (i \cdot \Delta\vec{u}_{\mathrm{pixel}}) + (j \cdot \Delta\vec{v}_{\mathrm{pixel}})$

---

## 2. Mathematical Proof: Simple Camera from General ONB

To prove that simple axis-aligned camera vectors are a direct mathematical consequence of the general camera formulation, we evaluate the general **Orthonormal Basis (ONB)** equations using baseline camera parameters.

---

### Baseline Parameters

1. **Camera Position ($\mathbf{E}$):** $(0, 0, 0)$
2. **Target Point ($\mathbf{T}$):** Looking down negative $Z$-axis $\rightarrow (0, 0, -1)$
3. **World Up Vector ($\vec{v}_{\mathrm{up}}$):** $(0, 1, 0)$

---

### Step-by-Step Proof

#### **Step 1: Compute Unit Vector $\vec{w}$ (Local $Z$-axis)**

The vector $\vec{w}$ points opposite to the camera's view direction:

$$\mathbf{E} - \mathbf{T} = (0, 0, 0) - (0, 0, -1) = (0, 0, 1)$$

Normalizing to a unit vector:

$$\vec{w} = \frac{(0, 0, 1)}{\|(0, 0, 1)\|} = (0, 0, 1)$$

---

#### **Step 2: Compute Unit Vector $\vec{u}$ (Local $X$-axis)**

$\vec{u}$ represents the camera's local **Right** direction, obtained via cross product $\vec{v}_{\mathrm{up}} \times \vec{w}$:

$$\vec{u}_{\mathrm{raw}} = \vec{v}_{\mathrm{up}} \times \vec{w} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix}$$

Expanding the determinant:

$$\vec{u}_{\mathrm{raw}} = \mathbf{i}(1 \cdot 1 - 0 \cdot 0) - \mathbf{j}(0 \cdot 1 - 0 \cdot 0) + \mathbf{k}(0 \cdot 0 - 1 \cdot 0) = (1, 0, 0)$$

Normalizing:

$$\vec{u} = \frac{(1, 0, 0)}{\|(1, 0, 0)\|} = (1, 0, 0)$$

---

#### **Step 3: Compute Unit Vector $\vec{v}$ (Local $Y$-axis)**

$\vec{v}$ represents the camera's local **Up** direction, given by $\vec{w} \times \vec{u}$:

$$\vec{v} = \vec{w} \times \vec{u} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{vmatrix}$$

Expanding the determinant:

$$\vec{v} = \mathbf{i}(0 \cdot 0 - 1 \cdot 0) - \mathbf{j}(0 \cdot 0 - 1 \cdot 1) + \mathbf{k}(0 \cdot 0 - 0 \cdot 1) = (0, 1, 0)$$

---

#### **Step 4: Scale by Viewport Dimensions**

Plugging $\vec{u} = (1, 0, 0)$ and $\vec{v} = (0, 1, 0)$ into the generalized viewport equations:

1. **Horizontal Edge Vector:**  
   $\vec{u}_{\mathrm{viewport}} = \mathrm{viewport\_width} \cdot \vec{u} = \mathrm{viewport\_width} \cdot (1, 0, 0) = (\mathrm{viewport\_width},\ 0,\ 0)$

2. **Vertical Edge Vector:**  
   $\vec{v}_{\mathrm{viewport}} = -\mathrm{viewport\_height} \cdot \vec{v} = -\mathrm{viewport\_height} \cdot (0, 1, 0) = (0,\ -\mathrm{viewport\_height},\ 0)$

$$\blacksquare$$

---

### Conclusion

The simple hardcoded vectors $(\mathrm{viewport\_width},\ 0,\ 0)$ and $(0,\ -\mathrm{viewport\_height},\ 0)$ are not arbitrary shortcuts — they are the exact mathematical output of an **Orthonormal Basis (ONB)** constructed at the origin looking down $-Z$.

---

## 3. Related Resources

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)

* **Video Tutorial:** [How to Make a Basis Orthonormal (YouTube)](http://www.youtube.com/watch?v=ZlQHxWjAT8E)