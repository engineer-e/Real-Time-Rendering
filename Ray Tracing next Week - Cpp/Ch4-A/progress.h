#include <iostream>
#include <iomanip>

void print_progress_bar(int current, int total)
{
    const int bar_width = 50;

    double progress = static_cast<double>(current) / total;
    int filled = static_cast<int>(bar_width * progress);

    std::clog << '\r';   // move cursor to beginning

    std::clog << '[';

    for (int i = 0; i < bar_width; i++)
    {
        if (i < filled)
            std::clog << '#';
        else
            std::clog << '-';
    }

    std::clog << "] "
              << std::setw(3) << static_cast<int>(progress * 100)
              << "% "
              << "Scanlines remaining: "
              << std::setw(5) << (total - current)
              << "   "
              << std::flush;
}