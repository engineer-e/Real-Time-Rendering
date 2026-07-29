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
9. <details>
    <summary>Diffuse Materials ✔️</summary>
    
    - 9.1 [A Simple Diffuse Material ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-A/main.html)
    - 9.2 [Limiting the Number of Child Rays ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-B/main.html)
    - 9.3 [Fixing Shadow Acne ✔️](https://engineer-e.github.io/Real-Time-RenderingRay%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-C/main.html)      
    - 9.4 [True Lambertian Reflection ✔️](https://engineer-e.github.io/Real-Time-RenderingRay%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-D/main.html)
    - 9.5 [Using Gamma Correction for Accurate Color Intensity ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch9-E/main.html)
    
    [![Watch the video](https://img.youtube.com/vi/NRuh2A7UIcs/maxresdefault.jpg)](https://youtu.be/NRuh2A7UIcs?si=me6q_5Ys8_aKqByl) 
  
   </details>
10. <details> 
     <summary>Metal ✔️</summary>
    
    - 10.1 An Abstract Class for Materials 
    - 10.2 A Data Structure to Describe Ray-Object Intersections
    - 10.3 Modeling Light Scatter and Reflectance
    - 10.4 Mirrored Light Reflection
    - **Note:** Chapters 10.1–10.4 define the core material system (material abstraction, hit records, light scattering, and reflection). These implementations are used together to render the final scenes in 10.5 (A Scene with Metal Spheres) and 10.6 (Fuzzy Reflection).
    - 10.5 [A Scene with Metal Spheres ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch10/main.html)
    - 10.6 [Fuzzy Reflection ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch10-F/main.html)

    [![Watch the video](https://img.youtube.com/vi/pfESOQ1LOk8/maxresdefault.jpg)](https://youtu.be/pfESOQ1LOk8?si=1URfi-VcRNXzPQfN)
    
    </details>  

11. <details> 
     <summary>Dielectrics ✔️</summary>
    
    - 11.1 Refraction 
    - 11.2 [Snell's Law ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch11-A/main.html)
    - 11.3 [Total Internal Reflection ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch11-B/main.html)
    - 11.4 Schlick Approximation
    - 11.5 [Modeling a Hollow Glass Sphere ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch11-C/main.html)
        
    </details>  

12. <details> 
     <summary>Positionable Camera ✔️</summary>
    
    - 12.1 [Camera Viewing Geometry ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch12-A/main.html) 
    - 12.2 [Positioning and Orienting the Camera ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch12-B/main.html)
    
        
    </details> 

13. <details> 
     <summary>Defocus Blur ✔️</summary>

    - 13.1 A Thin Lens Approximation
    - 13.2 [Generating Sample Rays ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch13/main.html)
    
        
    </details> 
14. Where Next?
    - 14.1 [A Final Render ✔️](https://engineer-e.github.io/Real-Time-Rendering/Ray%20Tracing%20in%20One%20Weekend%20-%20Javascript/Ch14/main.html)

---

# Real-Time-Rendering


* 👋 I am **Gobal Krishnan V**. I am doing this for learning purposes. 📚
* 💻 I am using the material [RayTracing](https://raytracing.github.io/). It is written in C++, but I am implementing it in **Python** & **JavaScript**. 🚀
* ⚠️ [My device](https://github.com/engineer-e/LLM-Python/blob/main/the_computer_i_used.md) was damaged due to voltage fluctuations. 💥💻 I am using my younger brother's laptop, ["Kishore Kumar V" 💻 Laptop](https://github.com/engineer-e/LLM-Python/blob/main/the_computer_i_using.md). ❤️ [system info](https://github.com/engineer-e/Real-Time-Rendering/blob/main/system_info.txt) ❤️, [gpu info](https://github.com/engineer-e/Real-Time-Rendering/blob/main/gpu_info.txt) ❤️
* 🩺 Due to health issues, I resigned from my job in **June 2025**. 💼 I have been searching for a job for the past **1 year**, but I have not gotten one yet. 🙏


![book cover](https://raw.githubusercontent.com/engineer-e/Real-Time-Rendering/refs/heads/main/image/bookcover.png)


[![Electronic Profile](https://img.shields.io/badge/Electronic%20Profile-engineer--e-181717?logo=github)](https://github.com/engineer-e/) 
[![Work Profile](https://img.shields.io/badge/Work%20Profile-engineer--work-181717?logo=github)](https://github.com/engineer-work/) 
[![Instagram](https://img.shields.io/badge/Instagram-gobalkrishnan.engineer-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/gobalkrishnan.engineer/)
[![Personal Profile](https://img.shields.io/badge/Personal%20Profile-Thought%20Cortex-blue?logo=protondb&logoColor=white)](https://engineer-work.github.io/Join-Company/)

---
  
