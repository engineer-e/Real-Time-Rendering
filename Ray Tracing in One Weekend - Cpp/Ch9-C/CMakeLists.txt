cmake_minimum_required(VERSION 3.22)

project(Ch9_C)

set(CMAKE_CXX_STANDARD 17)

set(OUTPUT_DIR ${CMAKE_SOURCE_DIR}/output)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${OUTPUT_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${OUTPUT_DIR})

add_executable(Ch9_C
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
)

# Run program after build to create image.ppm
add_custom_command(
    TARGET Ch9_C
    POST_BUILD
    COMMAND ${OUTPUT_DIR}/Ch9_C.exe > image.ppm
    WORKING_DIRECTORY ${OUTPUT_DIR}
    COMMENT "Generating image.ppm..."
)