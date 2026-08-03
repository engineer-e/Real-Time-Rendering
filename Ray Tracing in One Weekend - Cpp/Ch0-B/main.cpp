#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif


#ifdef __EMSCRIPTEN__

extern "C"
{

EMSCRIPTEN_KEEPALIVE
void printMessage(const char* msg)
{
    EM_ASM({
        document.getElementById("output").innerHTML += UTF8ToString($0) + "<br>";
    }, msg);
}


EMSCRIPTEN_KEEPALIVE
void menu(int option)
{
    switch(option)
    {
        case 1:
            printMessage("Rendering started");
            break;

        case 2:
            printMessage("Settings opened");
            break;

        case 3:
            printMessage("Application closed");
            break;

        default:
            printMessage("Invalid option");
            break;
    }
}

}

#else

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

        switch(choice)
        {
            case 1:
                std::cout << "Rendering started\n";
                break;

            case 2:
                std::cout << "Settings opened\n";
                break;

            case 3:
                std::cout << "Application closed\n";
                return 0;

            default:
                std::cout << "Invalid option\n";
        }
    }

    return 0;
}

#endif