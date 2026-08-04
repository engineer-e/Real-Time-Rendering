cmake_minimum_required(VERSION 3.22)

project(Ch12_A)

set(CMAKE_CXX_STANDARD 17)

set(OUTPUT_DIR ${CMAKE_SOURCE_DIR}/output)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${OUTPUT_DIR})

add_executable(Ch12_A
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
)

# Run program after build to create image.ppm
add_custom_command(
    TARGET Ch12_A
    POST_BUILD
    COMMAND ${OUTPUT_DIR}/Ch12_A.exe > image.ppm
    WORKING_DIRECTORY ${OUTPUT_DIR}
    COMMENT "Generating image.ppm..."
)