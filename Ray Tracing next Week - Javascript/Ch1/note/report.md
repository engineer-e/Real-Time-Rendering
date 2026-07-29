You can document the experiment parameters separately from the output statistics. A clean way is:

### Rendering Performance Test Configuration

| Trial        | enableStats | enableDetailedStats | enableVec3Timing | Purpose                                                                      |
| ------------ | ----------- | ------------------- | ---------------- | ---------------------------------------------------------------------------- |
| Baseline OFF | false       | false               | false            | Measure raw renderer performance without statistics overhead                 |
| Stats ON     | true        | false               | false            | Measure basic statistics collection cost (Vec3 creation count, rays, timing) |
| Trial 1      | true        | true                | false            | Measure detailed vector operation frequency                                  |
| Trial 2      | true        | true                | false            | Repeat detailed vector profiling with different random scene generation      |
| Trial 3      | true        | true                | false            | Repeat detailed vector profiling for comparison                              |

---

### Common Rendering Parameters

| Parameter             |                   Value |
| --------------------- | ----------------------: |
| Image Pixels Rendered |                 811,876 |
| Samples per Pixel     |     Same for all trials |
| Maximum Ray Depth     |                      50 |
| Objects in Scene      |                ~100–103 |
| Renderer Type         |        CPU Path Tracing |
| Camera                |         Defocus enabled |
| Ray Generation        |   Random pixel sampling |
| Vector Architecture   | Object-based Vec3 class |

---

### Summary Statistics Comparison

| Test             | Total Render Time (ms) | Vec3 Created | Ray Color Calls | Hit Tests | Scatter Calls |
| ---------------- | ---------------------: | -----------: | --------------: | --------: | ------------: |
| Stats OFF        |                6066 ms |            0 |       2,022,383 | 2,022,181 |     1,210,507 |
| Stats ON         |                7124 ms |  255,552,053 |       1,988,396 | 1,988,205 |     1,176,520 |
| Detailed Trial 1 |                6779 ms |  254,559,538 |       1,996,194 | 1,996,090 |     1,184,318 |
| Detailed Trial 2 |                6978 ms |  258,700,038 |       1,997,710 | 1,997,616 |     1,185,834 |
| Detailed Trial 3 |                6876 ms |  247,969,531 |       1,959,632 | 1,959,533 |     1,147,756 |

---

### Detailed Vector Operation Profiling (Detailed Trials)

| Operation          |     Trial 1 |     Trial 2 |     Trial 3 |
| ------------------ | ----------: | ----------: | ----------: |
| add                |   7,005,136 |   6,995,798 |   6,874,983 |
| sub                | 204,294,651 | 208,454,635 | 198,611,246 |
| mul                |  13,216,140 |  13,215,481 |  13,007,145 |
| div                |   3,869,652 |   3,883,623 |   3,804,969 |
| length_squared     | 407,553,053 | 415,872,080 | 396,214,811 |
| dot                | 203,965,043 | 208,109,396 | 198,238,280 |
| unit_vector        |   1,170,624 |   1,167,983 |   1,163,547 |
| random_double      |   8,236,675 |   8,331,563 |   8,226,217 |
| random_unit_vector |   1,056,779 |   1,073,094 |   1,059,982 |
| reflect            |     235,436 |     245,765 |     264,630 |
| refract            |     123,416 |     110,436 |      87,140 |
| neg                |     319,159 |     284,006 |     223,053 |

---

### Observation Notes

| Finding                                  | Evidence                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| Vec3 allocation is extremely high        | ~248–259 million Vec3 objects created per render                          |
| Main expensive operation                 | `length_squared()` and `dot()` dominate (~400M and ~200M calls)           |
| Subtraction is also heavy                | ~200 million `Vec3.sub()` operations                                      |
| BVH is not the first optimization target | Only ~100 objects, but vector workload is hundreds of millions            |
| Current bottleneck                       | Vec3 object creation + vector math architecture                           |
| First optimization target                | Reduce temporary Vec3 allocations and replace unnecessary object creation |
| Later optimization target                | BVH/spatial partition when object count increases (thousands/millions)    |

The table shows that **BVH is not the current bottleneck**. Your statistics prove the renderer is spending huge effort inside the `Vec3` architecture: around **250 million object allocations per frame**. Spatial partitioning would reduce `hitTests`, but your current problem is that every ray bounce creates massive temporary vector objects.


---


Add this note to the experiment documentation:

| Note                            | Explanation                                                                                                                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Random variation warning        | The measured render time, ray count, scatter count, and Vec3 creation count can vary between runs because path tracing uses random sampling (`Math.random()`) for ray generation, material scattering, defocus sampling, and pixel sampling. |
| Current trials                  | The 5 measurements shown are single samples from a stochastic renderer, so they represent observations, not exact fixed performance values.                                                                                                  |
| Statistical validation required | To properly compare architecture changes, the experiment should be repeated many times (for example 100,000 independent runs) and analyzed using probability distribution methods.                                                           |
| Recommended method              | Use a Bernoulli/binomial statistical model to measure the probability that one implementation consistently performs better than another.                                                                                                     |
| Success condition               | Define a success event, for example: "Optimized Vec3 architecture renders faster than current Vec3 architecture." Each run becomes a binary outcome: Success = 1, Failure = 0.                                                               |
| Probability estimation          | After N repeated runs, calculate the success probability: `p = successful_runs / total_runs`.                                                                                                                                                |
| Confidence                      | A large number of trials reduces random noise and gives confidence that the performance improvement is caused by the code change, not random ray sampling variation.                                                                         |
| Comparison requirement          | Before deciding "Vec3 architecture improvement is faster", compare distributions of render time, Vec3 allocation count, rayColor calls, and hit tests across many runs.                                                                      |

Example experimental statement:

> Because the renderer is based on stochastic Monte Carlo path tracing, individual benchmark results may vary between executions. The five trials shown are only samples of the possible performance distribution. A statistically reliable comparison requires repeating the experiment many times (for example 100,000 runs) and applying Bernoulli/binomial probability analysis to estimate the probability that one implementation consistently outperforms another. Only after statistical validation should an architectural change such as Vec3 optimization be accepted.

For this renderer, the important random variables to collect are:

| Metric                      | Random Variation Source             |
| --------------------------- | ----------------------------------- |
| Render Time                 | Different ray paths, CPU scheduling |
| Ray Color Calls             | Different bounce termination paths  |
| Scatter Calls               | Random material scattering          |
| Vec3 Created                | Different ray traversal paths       |
| Hit Tests                   | Different recursive ray paths       |
| Reflection/Refraction Count | Random material interaction         |

The current data already shows a strong signal: **Vec3 allocation remains around 250 million objects in every detailed trial**, but the exact value fluctuates by several million because the renderer is probabilistic. A large-run statistical test would confirm whether an optimization produces a real improvement.
