

def write_color(pixel_color):
    r = pixel_color.x
    g = pixel_color.y
    b = pixel_color.z

    # Translate [0,1] → [0,255]
    rbyte = int(255.999 * r)
    gbyte = int(255.999 * g)
    bbyte = int(255.999 * b)

    return f"{rbyte} {gbyte} {bbyte}\n"