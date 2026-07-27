# Ray Tracing in One Weekend - Javascript

1. [Framebuffer Initialization](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch1/main.html)
2. [Output An Image](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch2/main.html)
3. [The vec3 Class](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch3/main.html)
4. [Rays, a Simple Camera, and Background](https://rawcdn.githack.com/engineer-e/Real-Time-Rendering/160088ed0a93ac7785df785ad72c56668b79558c/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch4/main.html), [Changes](../Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch4/note/changes.md), [Metric](../Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch4/note/performance_metric.md)
5. [Adding a Sphere](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch5/main.html)
6. 
   - Surface Normal
     - 6.1 [Shading with Surface Normals ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch6-A/main.html)
     - 6.2 [Simplifying the Ray-Sphere Intersection Code ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch6-B/main.html) 
   - [Multiple Objects ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch6-C/main.html)
      - **Note :** Before doing "*Multiple Object*" from "*Simplifying the Ray-Sphere Intersection Code*" 
          - 6.3 An Abstraction for Hittable Objects
          - 6.4 Front Faces Versus Back Faces
          - 6.5 A List of Hittable Objects
          - 6.6 Some New C++ Features to Javascript
          - 6.7 Common Constants and Utility Functions
          - 6.8 An Interval Class
7. [Camera ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch7/main.html)
8. <details>
    <summary> <a href="https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch8/main.html" >Antialiasing ✔️</a>  </summary>
    
    - **Note:** Right-click the rendered image and choose "Save image as...". Compare the outputs of Chapter 7 (Camera) and Chapter 8 (Antialiasing) by zooming in. The Chapter 8 image should have noticeably smoother edges and fewer jagged artifacts, confirming that antialiasing is working correctly. [www.img2go.com](https://www.img2go.com/compare-image),[scanly.co](https://scanly.co/image-comparison)
      [![Watch the video](https://img.youtube.com/vi/Xch17MA2F94/maxresdefault.jpg)](https://youtu.be/Xch17MA2F94?si=MGR9ywGuinl98VmF)
      - **Note:** In the Controls, *Ray Hit Pixel* represents the `sampleOffset` ($O$) for ray hit position, and *Pixelated* represents the `pixelBlockSize` ($S$) for pixel enlargement visualization. I added additional algorithmic steps because these pixel zooming and visualization algorithms are not explained in the book.
      - **Note on Optimizations (Coarse Pixel Shading):**
        - **Sampling Stride (`pixelBlockSize` / $S$):** Defines the macroblock step size (e.g., $4 \times 4$) across the scanline grid (represented in UI controls as *Pixelated*).
        - **Grid Phase Offset (`sampleOffset` / $O$):** Defines the anchor coordinate inside each block where full ray evaluation triggers (represented in UI controls as *Ray Hit Pixel*).
        - **Academic Reference:** For theoretical foundations on strided sampling and coarse pixel shading, refer to *Real-Time Rendering* (4th Edition) by Tomas Akenine-Möller et al.
        [![Watch the video](https://img.youtube.com/vi/a8luLzy_5HY/maxresdefault.jpg)](https://youtu.be/a8luLzy_5HY?si=dk-hrBFE0G1Ilgpj)
      </details>
9. Diffuse Materials
  - 9.1 [A Simple Diffuse Material ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-A/main.html)
  - 9.2 [Limiting the Number of Child Rays ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-B/main.html)
  - 9.3 [Fixing Shadow Acne ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-C/main.html)      
  - 9.4 [True Lambertian Reflection ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-D/main.html)
  - 9.5 [Using Gamma Correction for Accurate Color Intensity](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-D/main.html)
  