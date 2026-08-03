#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif


void render()
{
    std::cout << "Rendering started\n";
}


void settings()
{
    std::cout << "Settings opened\n";
}


void exitApp()
{
    std::cout << "Application closed\n";
}


extern "C"
{

#ifdef __EMSCRIPTEN__

EMSCRIPTEN_KEEPALIVE
void menu(int option)
{
    switch(option)
    {
        case 1:
            render();
            break;

        case 2:
            settings();
            break;

        case 3:
            exitApp();
            break;

        default:
            std::cout << "Invalid option\n";
            break;
    }
}

#endif

}


#ifndef __EMSCRIPTEN__

int main()
{
    while(true)
    {
        std::cout << "\n===== MENU =====\n";
        std::cout << "1. Render\n";
        std::cout << "2. Settings\n";
        std::cout << "3. Exit\n";

        int choice;
        std::cin >> choice;

        menu(choice);
    }

    return 0;
}

#endif