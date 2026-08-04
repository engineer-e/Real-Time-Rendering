#include <iostream>
#include "progress.h"

int main()
{
    int image_width = 1920;
    double aspect_ratio = 16.0 / 9.0;
    int image_height = static_cast<int>(image_width / aspect_ratio);

    std::cout << "P3\n"
              << image_width << ' ' << image_height << "\n255\n";

    for (int j = 0; j < image_height; ++j)
    {
        for (int i = 0; i < image_width; ++i)
        {
            auto r = double(i) / (image_width - 1);
            auto g = double(j) / (image_height - 1);
            auto b = 0.0;

            int ir = int(255.999 * r);
            int ig = int(255.999 * g);
            int ib = int(255.999 * b);

            std::cout << ir << ' '
                      << ig << ' '
                      << ib << '\n';
        }

        print_progress_bar(j + 1, image_height);
    }

    std::clog << "\nDone.\n";
}