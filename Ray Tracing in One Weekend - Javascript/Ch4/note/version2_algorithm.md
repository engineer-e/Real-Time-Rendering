# Camera Initialization Algorithm

## Input Parameters

- `image_width`: Target image width in pixels
- `image_height`: Target image height in pixels
- `focal_length`: Distance from the camera origin to the virtual image plane (default: `1.0`)
- `viewport_height`: Physical height of the virtual screen in world units (default: `2.0`)

---

## Algorithm

### 1. Define Camera Position

- $$
  \text{camera center} \leftarrow (0, 0, 0)
  $$

---

### 2. Determine Viewport Dimensions

- $$
  \text{aspect ratio} \leftarrow
  \frac{\text{image width}}{\text{image height}}
  $$

- $$
  \text{viewport width}
  \leftarrow
  \text{viewport height}
  \times
  \text{aspect ratio}
  $$

---

### 3. Define Viewport Spatial Edge Vectors

- $$
  \vec{u}_{\text{viewport}}
  \leftarrow
  (\text{viewport width},\ 0,\ 0)
  $$

- $$
  \vec{v}_{\text{viewport}}
  \leftarrow
  (0,\ -\text{viewport height},\ 0)
  $$

  *(Negative $Y$ ensures top-to-bottom scanlines.)*

---

### 4. Compute Per-Pixel Step Vectors

- $$
  \Delta\vec{u}_{\text{pixel}}
  \leftarrow
  \frac{\vec{u}_{\text{viewport}}}
       {\text{image width}}
  $$

- $$
  \Delta\vec{v}_{\text{pixel}}
  \leftarrow
  \frac{\vec{v}_{\text{viewport}}}
       {\text{image height}}
  $$

---

### 5. Position Viewport Boundaries

- $$
  \text{viewport center}
  \leftarrow
  \text{camera center}
  -
  (0,\ 0,\ \text{focal length})
  $$

- $$
  \text{viewport upper left}
  \leftarrow
  \text{viewport center}
  -
  \frac{\vec{u}_{\text{viewport}}}{2}
  -
  \frac{\vec{v}_{\text{viewport}}}{2}
  $$

---

### 6. Locate Center of Pixel $(0,0)$

- $$
  \text{pixel00 loc}
  \leftarrow
  \text{viewport upper left}
  +
  0.5
  \times
  \left(
  \Delta\vec{u}_{\text{pixel}}
  +
  \Delta\vec{v}_{\text{pixel}}
  \right)
  $$

---

## Output State

The setup yields:

- **Camera Origin**

  $$
  \text{camera center}
  $$

- **Starting Pixel Center**

  $$
  \text{pixel00 loc}
  $$

- **Horizontal Delta Vector**

  $$
  \Delta\vec{u}_{\text{pixel}}
  $$

- **Vertical Delta Vector**

  $$
  \Delta\vec{v}_{\text{pixel}}
  $$

For any pixel $(i,j)$, its exact 3D center location is

$$
\text{pixel00 loc}
+
(i \times \Delta\vec{u}_{\text{pixel}})
+
(j \times \Delta\vec{v}_{\text{pixel}})
$$

---

# Proof Using the General Camera Formulation (ONB)

To prove that the simple axis-aligned camera vectors are a direct mathematical consequence of the general camera formulation, we evaluate the general **Orthonormal Basis (ONB)** equations using the baseline camera parameters.

---

## Given Parameters for the Simple Camera

1. **Camera Position ($\mathbf{E}$):**

   $$
   (0,0,0)
   $$

2. **Target Point ($\mathbf{T}$):**

   Looking down the negative $Z$-axis

   $$
   (0,0,-1)
   $$

3. **World Up Vector ($\vec{v}_{\text{up}}$):**

   $$
   (0,1,0)
   $$

---

## Step 1: Compute Unit Vector $\vec{w}$ (Local $Z$-Axis)

The vector $\vec{w}$ points in the direction opposite to where the camera is looking.

$$
\mathbf{E}-\mathbf{T}
=
(0,0,0)
-
(0,0,-1)
=
(0,0,1)
$$

Normalize the vector:

$$
\vec{w}
=
\frac{(0,0,1)}
{\|(0,0,1)\|}
=
(0,0,1)
$$

---

## Step 2: Compute Unit Vector $\vec{u}$ (Local $X$-Axis)

$\vec{u}$ represents the camera's local **Right** direction.

$$
\vec{u}_{\text{raw}}
=
\vec{v}_{\text{up}}
\times
\vec{w}
=
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
0 & 1 & 0 \\
0 & 0 & 1
\end{vmatrix}
$$

Expanding the determinant:

$$
\vec{u}_{\text{raw}}
=
\mathbf{i}(1\cdot1-0\cdot0)
-
\mathbf{j}(0\cdot1-0\cdot0)
+
\mathbf{k}(0\cdot0-1\cdot0)
=
(1,0,0)
$$

Normalize:

$$
\vec{u}
=
\frac{(1,0,0)}
{\|(1,0,0)\|}
=
(1,0,0)
$$

---

## Step 3: Compute Unit Vector $\vec{v}$ (Local $Y$-Axis)

$\vec{v}$ represents the camera's local **Up** direction.

$$
\vec{v}
=
\vec{w}
\times
\vec{u}
=
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
0 & 0 & 1 \\
1 & 0 & 0
\end{vmatrix}
$$

Expanding the determinant:

$$
\vec{v}
=
\mathbf{i}(0\cdot0-1\cdot0)
-
\mathbf{j}(0\cdot0-1\cdot1)
+
\mathbf{k}(0\cdot0-0\cdot1)
=
(0,1,0)
$$

---

## Step 4: Scale by Viewport Dimensions

Plugging $\vec{u}=(1,0,0)$ and $\vec{v}=(0,1,0)$ into the generalized viewport equations:

### Horizontal Edge Vector

$$
\vec{u}_{\text{viewport}}
=
\text{viewport width}
\cdot
\vec{u}
=
\text{viewport width}
\cdot
(1,0,0)
=
(\text{viewport width},\ 0,\ 0)
$$

### Vertical Edge Vector

$$
\vec{v}_{\text{viewport}}
=
-
\text{viewport height}
\cdot
\vec{v}
=
-
\text{viewport height}
\cdot
(0,1,0)
=
(0,\ -\text{viewport height},\ 0)
$$

$$
\blacksquare
$$

---

## Conclusion

This completes the proof.

The simple hardcoded vectors

$$
(\text{viewport width},\ 0,\ 0)
$$

and

$$
(0,\ -\text{viewport height},\ 0)
$$

are **not arbitrary rules of thumb**. They are the exact mathematical result of applying an **Orthonormal Basis (ONB)** to a camera at the origin looking down the negative $Z$-axis.

---

## Reference

**How to Make a Basis Orthonormal**

[![How to Make a Basis Orthonormal](https://thumbs.video-to-markdown.com/73ff2b11.jpg)](https://youtu.be/ZlQHxWjAT8E)