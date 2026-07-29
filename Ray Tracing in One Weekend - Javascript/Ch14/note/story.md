Gobal was testing his JavaScript ray tracer by running the same scene through five different trials and collecting detailed performance statistics before making any major optimization decisions. The scene contained around 100 objects, and every trial generated the same 811,876 primary rays, but the internal ray paths changed slightly because of random scattering, reflection, and refraction. Across the five trials, the renderer consistently performed around 1.95–2.02 million `ray_color` calls and created approximately 248–259 million `Vec3` objects per render. The render time stayed in the range of about 6–7 seconds, showing that the overall workload was stable. When Gobal compared the vector operations, he discovered that the largest mathematical workload was not object searching but repeated vector calculations: around 400 million `length_squared()` operations, around 200 million `dot()` operations, and around 200 million `sub()` operations in each detailed-stat trial. The most important discovery was that the current `Vec3` architecture was creating a huge number of temporary objects because every operation such as addition, subtraction, multiplication, and division returned a new `Vec3` instance. Even though the scene only had about 100 objects, the renderer was creating hundreds of millions of small vector objects during one image render. The comparison between trials showed that the variation in operation counts was caused by different random ray bounce paths, not by a change in the architecture or scene complexity. The statistics proved that the first optimization target should not be BVH or spatial partitioning, because object intersection was not the main bottleneck at this stage. The real problem was the mathematical layer itself: the `Vec3` design was causing excessive memory allocation and garbage collection pressure. Therefore, the next step in improving the renderer is to redesign the vector system by reducing temporary `Vec3` creation, introducing reusable or mutable vector operations, and measuring the performance again before moving to advanced acceleration structures like BVH.

---

### Ray Tracer Performance Testing — 5 Trial Comparison Notes

| Trial   | Configuration                                                                        | Purpose / Note                                                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trial 1 | `enableStats = true`<br>`enableDetailedStats = false`<br>`enableVec3Timing = false`  | Basic renderer profiling enabled. Measures overall render time, ray count, hit tests, recursion, and Vec3 allocation count. Vector operation counters are disabled. Used as baseline with lightweight statistics. |
| Trial 2 | `enableStats = false`<br>`enableDetailedStats = false`<br>`enableVec3Timing = false` | Pure rendering test without profiling overhead. Used to measure the fastest possible execution time without statistics collection. Vec3 creation and operation data are not recorded.                             |
| Trial 3 | `enableStats = true`<br>`enableDetailedStats = true`<br>`enableVec3Timing = false`   | Full profiling mode. Tracks every vector operation (`add`, `sub`, `mul`, `dot`, `length_squared`, `reflect`, `refract`, etc.) to identify mathematical workload and architecture bottlenecks.                     |
| Trial 4 | `enableStats = true`<br>`enableDetailedStats = true`<br>`enableVec3Timing = false`   | Repeated detailed profiling run with the same architecture. Used to compare variation caused by random ray scattering, reflection, and refraction paths.                                                          |
| Trial 5 | `enableStats = true`<br>`enableDetailedStats = true`<br>`enableVec3Timing = false`   | Third detailed profiling run. Used to validate whether vector operation counts and Vec3 allocation behavior remain consistent across different random ray paths.                                                  |

### Overall Testing Note

| Observation                | Result                                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| Primary rays               | Constant across all trials: **811,876 rays**                                 |
| Scene complexity           | Around **100–103 objects**                                                   |
| Render time range          | Approximately **6–7 seconds**                                                |
| Ray recursion workload     | Around **1.95–2.02 million `ray_color()` calls**                             |
| Vec3 allocation            | Approximately **248–259 million Vec3 objects per render**                    |
| Largest vector workload    | `length_squared()` ≈ **400 million calls**                                   |
| Major arithmetic workload  | `dot()` and `sub()` ≈ **200 million calls each**                             |
| Main bottleneck identified | Excessive temporary `Vec3` object creation                                   |
| BVH decision               | Not the first optimization target because object count is low (~100 objects) |
| Next optimization step     | Redesign `Vec3` memory usage and reduce temporary object allocations         |

**Conclusion:** The five trials confirm that the renderer's main performance issue is the current vector object architecture rather than scene intersection speed. The profiling data should be used first to optimize `Vec3` allocation before introducing BVH or spatial acceleration.

----

# 🤔 We find issue in vec3 class, but not get check on material, hitrecord, ? did is need that in this stage?

Yes, **Material and HitRecord should also be checked**, but **not before fixing the Vec3 issue**. The profiling order should follow the evidence from your statistics.

From your current data:

| Component               | Evidence from profiler                                                            | Current priority   |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------ |
| Vec3 class              | ~250 million `Vec3` objects created per render                                    | 🔴 First priority  |
| Vec3 operations         | `length_squared()` ~400 million, `dot()` ~200 million, `sub()` ~200 million calls | 🔴 First priority  |
| Material                | `scatterCalls` ~1.1–1.2 million                                                   | 🟡 Second priority |
| HitRecord               | ~2 million hit tests                                                              | 🟡 Second priority |
| BVH / Spatial Structure | Only ~100 objects                                                                 | 🟢 Later           |

Your current bottleneck is happening **below Material and HitRecord**.

The ray flow is:

```
Camera
  |
  v
Ray
  |
  v
World.hit()
  |
  +--> HitRecord creation/update
  |
  v
Material.scatter()
  |
  +--> Vec3 calculations
          |
          +--> add
          +--> sub
          +--> dot
          +--> length_squared
          +--> normalize
```

Even when Material.scatter() is called, most of its work is Vec3 mathematics.

Example:

Lambertian:

```javascript
scatter(r_in, rec)
{
    var scatter_direction =
        Vec3.add(
            rec.normal,
            Vec3.random_unit_vector()
        );

    scattered = new Ray(
        rec.p,
        scatter_direction
    );

    attenuation = this.albedo;
}
```

The expensive part is not the material itself. It is:

```
Vec3.add()
random_unit_vector()
length_squared()
unit_vector()
new Vec3()
```

---

### Recommended profiling order

| Stage | Component      | What to measure                                      |
| ----- | -------------- | ---------------------------------------------------- |
| 1     | Vec3           | Allocation count, temporary objects, operation count |
| 2     | HitRecord      | Object creation, copying, normal calculations        |
| 3     | Material       | Scatter frequency, random sampling cost              |
| 4     | Ray            | Construction and direction calculations              |
| 5     | Camera         | Ray generation overhead                              |
| 6     | World/Hittable | Intersection algorithms                              |
| 7     | BVH            | Only after object count increases                    |

---

### Why check HitRecord later?

Your current:

```
hitTests ≈ 2 million
```

but:

```
Vec3 operations:
dot ≈ 200 million
length_squared ≈ 400 million
sub ≈ 200 million
```

The ratio is very high:

```
1 hit test
    creates many vector operations
```

So optimizing HitRecord now may only save a small amount.

Example:

If HitRecord creation takes 5% of the time:

```
Render = 7 seconds

HitRecord optimization:
5% improvement

Saving = 0.35 seconds
```

But if Vec3 allocation is the cause:

```
250 million allocations
```

reducing that can affect the whole renderer.

---

## For Chapter 15 documentation, I would add this note:

### Profiling Scope

The first profiling phase identified the Vec3 architecture as the primary optimization target.

Although other components such as HitRecord, Material, Ray, and Hittable objects contribute to rendering cost, they depend heavily on vector mathematics internally.

Therefore, optimization is performed in dependency order:

1. Vec3 mathematical architecture
2. HitRecord data handling
3. Material scattering implementation
4. Ray and Camera construction
5. Geometry acceleration structures

> This prevents premature optimization of higher-level systems while lower-level mathematical operations dominate execution cost.

> So yes, **Material and HitRecord need profiling**, but your current evidence says **do not optimize them yet**. First understand and redesign the Vec3 data path.

---