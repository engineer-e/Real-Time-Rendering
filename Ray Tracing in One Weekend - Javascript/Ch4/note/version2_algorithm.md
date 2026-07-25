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
| **1** | **Define Camera Position** | $\text{camera\_center} \leftarrow (0, 0, 0)$ |
| **2** | **Determine Viewport Dimensions** | $\text{aspect\_ratio} \leftarrow \frac{\text{image\_width}}{\text{image\_height}}$ <br> $\text{viewport\_width} \leftarrow \text{viewport\_height} \times \text{aspect\_ratio}$ |
| **3** | **Define Viewport Edge Vectors** | $\vec{u}_{\text{viewport}} \leftarrow (\text{viewport\_width},\ 0,\ 0)$ <br> $\vec{v}_{\text{viewport}} \leftarrow (0,\ -\text{viewport\_height},\ 0)$ |
| **4** | **Compute Per-Pixel Step Vectors** | $\Delta\vec{u}_{\text{pixel}} \leftarrow \frac{\vec{u}_{\text{viewport}}}{\text{image\_width}}$ <br> $\Delta\vec{v}_{\text{pixel}} \leftarrow \frac{\vec{v}_{\text{viewport}}}{\text{image\_height}}$ |
| **5** | **Position Viewport Boundaries** | $\text{viewport\_center} \leftarrow \text{camera\_center} - (0,\ 0,\ \text{focal\_length})$ <br> $\text{viewport\_upper\_left} \leftarrow \text{viewport\_center} - \frac{\vec{u}_{\text{viewport}}}{2} - \frac{\vec{v}_{\text{viewport}}}{2}$ |
| **6** | **Locate Center of Pixel $(0, 0)$** | $\text{pixel00\_loc} \leftarrow \text{viewport\_upper\_left} + 0.5 \times (\Delta\vec{u}_{\text{pixel}} + \Delta\vec{v}_{\text{pixel}})$ |

---

### Output State

* **Camera Origin:** $\text{camera\_center}$
* **Starting Pixel Center:** $\text{pixel00\_loc}$
* **Horizontal Delta Vector:** $\Delta\vec{u}_{\text{pixel}}$
* **Vertical Delta Vector:** $\Delta\vec{v}_{\text{pixel}}$

> **Pixel Location Formula:**  
> For any pixel at coordinate $(i, j)$, its exact 3D center location is given by:  
> $\text{pixel\_center}(i, j) = \text{pixel00\_loc} + (i \cdot \Delta\vec{u}_{\text{pixel}}) + (j \cdot \Delta\vec{v}_{\text{pixel}})$

---

## 2. Mathematical Proof: Simple Camera from General ONB

To prove that simple axis-aligned camera vectors are a direct mathematical consequence of the general camera formulation, we evaluate the general **Orthonormal Basis (ONB)** equations using baseline camera parameters.

---

### Baseline Parameters

1. **Camera Position ($\mathbf{E}$):** $(0, 0, 0)$
2. **Target Point ($\mathbf{T}$):** Looking down negative $Z$-axis $\rightarrow (0, 0, -1)$
3. **World Up Vector ($\vec{v}_{\text{up}}$):** $(0, 1, 0)$

---

### Step-by-Step Proof

#### **Step 1: Compute Unit Vector $\vec{w}$ (Local $Z$-axis)**

The vector $\vec{w}$ points opposite to the camera's view direction:

$$\mathbf{E} - \mathbf{T} = (0, 0, 0) - (0, 0, -1) = (0, 0, 1)$$

Normalizing to a unit vector:

$$\vec{w} = \frac{(0, 0, 1)}{\|(0, 0, 1)\|} = (0, 0, 1)$$

---

#### **Step 2: Compute Unit Vector $\vec{u}$ (Local $X$-axis)**

$\vec{u}$ represents the camera's local **Right** direction, obtained via cross product $\vec{v}_{\text{up}} \times \vec{w}$:

$$\vec{u}_{\text{raw}} = \vec{v}_{\text{up}} \times \vec{w} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix}$$

Expanding the determinant:

$$\vec{u}_{\text{raw}} = \mathbf{i}(1 \cdot 1 - 0 \cdot 0) - \mathbf{j}(0 \cdot 1 - 0 \cdot 0) + \mathbf{k}(0 \cdot 0 - 1 \cdot 0) = (1, 0, 0)$$

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
   $\vec{u}_{\text{viewport}} = \text{viewport\_width} \cdot \vec{u} = \text{viewport\_width} \cdot (1, 0, 0) = (\text{viewport\_width},\ 0,\ 0)$

2. **Vertical Edge Vector:**  
   $\vec{v}_{\text{viewport}} = -\text{viewport\_height} \cdot \vec{v} = -\text{viewport\_height} \cdot (0, 1, 0) = (0,\ -\text{viewport\_height},\ 0)$

$$\blacksquare$$

---

### Conclusion

The simple hardcoded vectors $(\text{viewport\_width},\ 0,\ 0)$ and $(0,\ -\text{viewport\_height},\ 0)$ are not arbitrary shortcuts — they are the exact mathematical output of an **Orthonormal Basis (ONB)** constructed at the origin looking down $-Z$.

---

## 3. Related Resources

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)

* **Video Tutorial:** [How to Make a Basis Orthonormal (YouTube)](http://www.youtube.com/watch?v=ZlQHxWjAT8E)