#include <stdio.h>
#include <SDL/SDL.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

int main(int argc, char** argv)
{
    printf("Hello, world!\n");

    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        printf("SDL_Init failed\n");
        return 1;
    }

    SDL_Surface* screen = SDL_SetVideoMode(
        256,
        256,
        32,
        SDL_SWSURFACE
    );

    if (!screen)
    {
        printf("SDL_SetVideoMode failed\n");
        SDL_Quit();
        return 1;
    }

    if (SDL_MUSTLOCK(screen))
        SDL_LockSurface(screen);

    for (int i = 0; i < 256; i++)
    {
        for (int j = 0; j < 256; j++)
        {
            int alpha = (i + j) % 255;

            Uint32 pixel = SDL_MapRGBA(
                screen->format,
                i,
                j,
                255 - i,
                alpha
            );

            *((Uint32*)screen->pixels + i * 256 + j) = pixel;
        }
    }

    if (SDL_MUSTLOCK(screen))
        SDL_UnlockSurface(screen);

    SDL_Flip(screen);

    printf(
        "you should see a smoothly-colored square - no sharp lines but the square borders!\n"
    );

    printf(
        "and here is some text that should be HTML-friendly: "
        "amp: |&| double-quote: |\"| quote: |'| "
        "less-than, greater-than, html-like tags: |<cheez></cheez>|\n"
        "another line.\n"
    );

    SDL_Quit();

    return 0;
}