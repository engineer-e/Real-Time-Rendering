#  Ray Tracing: The Rest of Your Life 

1. Overview
2. A Simple Monte Carlo Program
   - 2.1 Estimating Pi
   - 2.2 Showing Convergence
   - 2.3 Stratified Samples (Jittering)  
3. One Dimensional Monte Carlo Integration
   - 3.1 Expected Value
   - 3.2 Integrating $x^2$
   - 3.3 Density Functions
   - 3.4 Constructing a PDF
   - 3.5 Choosing our Samples
   - 3.6 Approximating Distributions
   - 3.7 Importance Sampling
4. Monte Carlo Integration on the Sphere of Directions
5. Light Scattering
   - 5.1 Albedo
   - 5.2 Scattering
   - 5.3 The Scattering PDF 
6. Playing with Importance Sampling
   - 6.1 Returning to the Cornell Box
   - 6.2 Using a Uniform PDF instead of a Perfect Match
   - 6.3 Random Hemispherical Sampling 
7. Generating Random Directions
   - 7.1 Random Directions Relative to the Z Axis
   - 7.2 Uniform Sampling a Hemisphere
   - 7.3 Cosine Sampling a hemisphere
8. Orthonormal Bases
   - 8.1 Relative Coordinates
   - 8.2 Generating an Orthonormal Basis 
   - 8.3 The ONB Class
9. Sampling Lights Directly
   - 9.1 Getting the PDF of a Light
   - 9.2 Light Sampling
   - 9.3 Switching to Unidirectional Light
10. Mixture Densities
   - 10.1 The PDF Class 
   - 10.2 Sampling Directions towards a Hittable
   - 10.3 The Mixture PDF Class
11. Some Architectural Decisions
12. Cleaning Up PDF Management
    - 12.1 Diffuse  Versus Specular
    - 12.2 Handling Specular
    - 12.3 Sampling a Sphere Object
    - 12.4 Updating teh Sphere Code
    - 12.5 Adding PDF Functions to Hittable Lists
    - 12.6 Handling Surface Acne
13. The Rest of Your Life

---

# Real-Time-Rendering

- 👋 I am **Gobal Krishnan V**. I am doing this for learning purposes. 📚
- 💻 I am using the material [RayTracing](https://raytracing.github.io/). It is written in C++, but I am implementing it in **Python** & **JavaScript**. 🚀
- ⚠️ [My device](https://github.com/engineer-e/LLM-Python/blob/main/the_computer_i_used.md) was damaged due to voltage fluctuations. 💥💻 I am using my younger brother's laptop, ["Kishore Kumar V" 💻 Laptop](https://github.com/engineer-e/LLM-Python/blob/main/the_computer_i_using.md). ❤️ [system info](https://github.com/engineer-e/Real-Time-Rendering/blob/main/system_info.txt) ❤️, [gpu info](https://github.com/engineer-e/Real-Time-Rendering/blob/main/gpu_info.txt) ❤️
- 🩺 Due to health issues, I resigned from my job in **June 2025**. 💼 I have been searching for a job for the past **1 year**, but I have not gotten one yet. 🙏

![book cover](https://raw.githubusercontent.com/engineer-e/Real-Time-Rendering/refs/heads/main/image/bookcover.png)

[![Electronic Profile](https://img.shields.io/badge/Electronic%20Profile-engineer--e-181717?logo=github)](https://github.com/engineer-e/)
[![Work Profile](https://img.shields.io/badge/Work%20Profile-engineer--work-181717?logo=github)](https://github.com/engineer-work/)
[![Instagram](https://img.shields.io/badge/Instagram-gobalkrishnan.engineer-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/gobalkrishnan.engineer/)
[![Personal Profile](https://img.shields.io/badge/Personal%20Profile-Thought%20Cortex-blue?logo=protondb&logoColor=white)](https://engineer-work.github.io/Join-Company/)

---
