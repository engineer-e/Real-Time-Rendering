#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <SDL/SDL.h>

#include <vector>
#include <string>
#include <sstream>


#ifdef __EMSCRIPTEN__

#include <emscripten.h>
#include <emscripten/fetch.h>

#endif



SDL_Surface *screen = nullptr;


int image_width = 0;
int image_height = 0;


std::vector<unsigned char> rgb_pixels;

std::vector<Uint32> pixels;




// ------------------------------------------------------
// Read P3 PPM
// ------------------------------------------------------

bool loadPPM(
    const char *data,
    int size
)
{

    std::stringstream file(
        std::string(data,size)
    );


    std::string magic;


    file >> magic;



    if(magic != "P3")
    {
        printf(
            "Unsupported PPM format: %s\n",
            magic.c_str()
        );

        return false;
    }



    int maxColor;



    file >> image_width;
    file >> image_height;
    file >> maxColor;



    printf(
        "PPM Size : %d x %d\n",
        image_width,
        image_height
    );



    rgb_pixels.resize(
        image_width *
        image_height *
        3
    );



    for(int i=0;i<image_width*image_height;i++)
    {

        int r;
        int g;
        int b;


        file >> r >> g >> b;



        rgb_pixels[i*3+0] =
            (unsigned char)r;


        rgb_pixels[i*3+1] =
            (unsigned char)g;


        rgb_pixels[i*3+2] =
            (unsigned char)b;

    }



    return true;

}





// ------------------------------------------------------
// Convert RGB data to SDL pixels
// ------------------------------------------------------

void createSDLImage()
{

    pixels.resize(
        image_width *
        image_height
    );



    for(int i=0;i<image_width*image_height;i++)
    {

        pixels[i] =
            SDL_MapRGB(
                screen->format,
                rgb_pixels[i*3+0],
                rgb_pixels[i*3+1],
                rgb_pixels[i*3+2]
            );

    }

}





// ------------------------------------------------------
// Emscripten download
// ------------------------------------------------------

#ifdef __EMSCRIPTEN__


void fetch_success(
    emscripten_fetch_t *fetch
)
{

    printf(
        "Download success\n"
    );



    if(loadPPM(
        fetch->data,
        fetch->numBytes
    ))
    {


        SDL_FreeSurface(screen);



        screen =
            SDL_SetVideoMode(
                image_width,
                image_height,
                32,
                SDL_SWSURFACE
            );



        if(!screen)
        {
            printf(
                "SDL window creation failed\n"
            );

            emscripten_fetch_close(fetch);
            return;
        }



        createSDLImage();



        printf(
            "Window resized : %dx%d\n",
            image_width,
            image_height
        );

    }



    emscripten_fetch_close(fetch);

}





void fetch_error(
    emscripten_fetch_t *fetch
)
{

   printf("Download failed\n");
printf("URL         : %s\n", fetch->url);
printf("HTTP Status : %d\n", fetch->status);

    emscripten_fetch_close(fetch);

}





void downloadImage(
    const char *url
)
{

    printf(
        "Loading URL:\n%s\n",
        url
    );



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
        fetch_success;



    attr.onerror =
        fetch_error;




    emscripten_fetch(
        &attr,
        url
    );

}



#endif






// ------------------------------------------------------
// Get URL parameter
// ------------------------------------------------------

#ifdef __EMSCRIPTEN__

// std::string getImageURL()
// {

//     const char *url =
//         emscripten_run_script_string(
//             "new URLSearchParams(window.location.search).get('image')"
//         );



//     if(url)
//         return std::string(url);



//     return "";

// }

std::string getImageURL()
{
    char buffer[4096];

    EM_ASM({
        const value = new URLSearchParams(window.location.search).get("image") || "";
        stringToUTF8(value, $0, $1);
    }, buffer, sizeof(buffer));

    return std::string(buffer);
}

#endif






// ------------------------------------------------------
// Draw
// ------------------------------------------------------

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





// ------------------------------------------------------
// Loop
// ------------------------------------------------------

void main_loop()
{

    SDL_Event event;



    while(SDL_PollEvent(&event))
    {

        if(event.type == SDL_QUIT)
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





// ------------------------------------------------------
// Main
// ------------------------------------------------------

int main()
{

    printf(
        "SDL PPM Viewer\n"
    );



    SDL_Init(
        SDL_INIT_VIDEO
    );



    /*
       Temporary surface.
       Needed before loading because SDL requires
       a pixel format.
    */

    screen =
        SDL_SetVideoMode(
            1,
            1,
            32,
            SDL_SWSURFACE
        );



    if(!screen)
    {

        printf(
            "SDL init failed\n"
        );

        return 1;

    }





#ifdef __EMSCRIPTEN__


    std::string url =
        getImageURL();

        printf("Image URL = %s\n", url.c_str());


    if(url.empty())
    {

        printf(
            "Missing ?image URL\n"
        );

        return 1;

    }



    downloadImage(
        url.c_str()
    );



    emscripten_set_main_loop(
        main_loop,
        0,
        1
    );

    return 0;


#else


    printf(
        "Desktop loader not implemented\n"
    );

       SDL_Quit();


    return 0;

#endif



 
}