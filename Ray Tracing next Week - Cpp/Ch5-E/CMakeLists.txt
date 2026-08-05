cmake_minimum_required(VERSION 3.22)

project(Ch5_E)

set(CMAKE_CXX_STANDARD 17)

set(OUTPUT_DIR ${CMAKE_SOURCE_DIR}/output)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${OUTPUT_DIR})

add_executable(Ch5_E
    main.cpp
    progress.h
    vec3.h
    color.h
    ray.h
    rtweekend.h
    interval.h
    hittable.h
    hittable_list.h
    sphere.h
    camera.h
    material.h
    aabb.h
    bvh.h
    texture.h
    rtw_stb_image.h
    stb_image.h
    perlin.h
)

# Run program after build to create image.ppm
add_custom_command(
    TARGET Ch5_E
    POST_BUILD
    COMMAND ${OUTPUT_DIR}/Ch5_E.exe > image.ppm
    WORKING_DIRECTORY ${OUTPUT_DIR}
    COMMENT "Generating image.ppm..."
)