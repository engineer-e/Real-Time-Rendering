#include <stdio.h>
#include <SDL/SDL.h>

#include <vector>
#include <string>
#include <sstream>


#ifdef __EMSCRIPTEN__

#include <emscripten.h>
#include <emscripten/fetch.h>

#endif



SDL_Surface *screen;


int image_width;
int image_height;


std::vector<Uint32> pixels;



bool parsePPM(
    const char *data,
    int size
)
{
    std::stringstream ss(
        std::string(data,size)
    );


    std::string magic;


    ss >> magic;


    if(magic != "P3")
    {
        printf("Only P3 ppm supported\n");
        return false;
    }


    int maxColor;


    ss >> image_width;
    ss >> image_height;
    ss >> maxColor;



    pixels.resize(
        image_width *
        image_height
    );



    for(int i=0;i<image_width*image_height;i++)
    {
        int r,g,b;


        ss >> r >> g >> b;


        pixels[i] =
            SDL_MapRGB(
                screen->format,
                r,
                g,
                b
            );
    }


    return true;
}




#ifdef __EMSCRIPTEN__


void download_success(
    emscripten_fetch_t *fetch
)
{

    printf(
        "Downloaded ppm\n"
    );


    parsePPM(
        fetch->data,
        fetch->numBytes
    );


    emscripten_fetch_close(fetch);

}



void download_error(
    emscripten_fetch_t *fetch
)
{
    printf(
        "Failed loading image\n"
    );

    emscripten_fetch_close(fetch);
}



void loadURL(
    const char *url
)
{

    emscripten_fetch_attr_t attr;


    emscripten_fetch_attr_init(
        &attr
    );


    strcpy(
        attr.requestMethod,
        "GET"
    );


    attr.attributes =
        EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;


    attr.onsuccess =
        download_success;


    attr.onerror =
        download_error;



    emscripten_fetch(
        &attr,
        url
    );

}


#endif





void render()
{

    if(pixels.empty())
        return;



    if(SDL_MUSTLOCK(screen))
        SDL_LockSurface(screen);



    Uint32 *buffer =
        (Uint32*)screen->pixels;



    memcpy(
        buffer,
        pixels.data(),
        pixels.size()*sizeof(Uint32)
    );



    if(SDL_MUSTLOCK(screen))
        SDL_UnlockSurface(screen);



    SDL_Flip(screen);

}




void loop()
{

    SDL_Event event;


    while(SDL_PollEvent(&event))
    {

        if(event.type==SDL_QUIT)
        {
#ifdef __EMSCRIPTEN__

            emscripten_cancel_main_loop();

#else

            exit(0);

#endif
        }

    }


    render();

}




std::string getURLParameter()
{

#ifdef __EMSCRIPTEN__

    char buffer[1024];


    emscripten_run_script_string(
        "new URLSearchParams(window.location.search).get('image')"
    );


#endif


    return "";
}





int main()
{

    printf(
        "PPM Viewer\n"
    );


    SDL_Init(
        SDL_INIT_VIDEO
    );



    screen =
        SDL_SetVideoMode(
            800,
            600,
            32,
            SDL_SWSURFACE
        );



#ifdef __EMSCRIPTEN__


    // Example:
    // Ch2_A.html?image=/images/test.ppm

    loadURL(
        "/images/test.ppm"
    );


    emscripten_set_main_loop(
        loop,
        0,
        1
    );


#else


    // Desktop loading
    FILE *f =
        fopen(
            "images/test.ppm",
            "rb"
        );

#endif


    return 0;
}