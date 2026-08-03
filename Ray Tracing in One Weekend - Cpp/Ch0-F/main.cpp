#include <stdio.h>
#include <string.h>
#include <emscripten.h>

extern "C"
{

EMSCRIPTEN_KEEPALIVE
void init_fs()
{
    EM_ASM({

        if (!FS.analyzePath('/data').exists)
            FS.mkdir('/data');

        FS.mount(IDBFS, {}, '/data');

        FS.syncfs(true, function(err)
        {
            if(err)
                console.log(err);
            else
                console.log("Loaded");
        });

    });
}

EMSCRIPTEN_KEEPALIVE
void set_slider_value(int value)
{
    printf("Slider Value = %d\n", value);
}

EMSCRIPTEN_KEEPALIVE
void write_file(const char* text)
{
    FILE *file = fopen("/data/output.txt", "a");

    if(!file)
    {
        printf("Cannot open file\n");
        return;
    }

    fprintf(file, "%s\n", text);

    fclose(file);

    EM_ASM({

        FS.syncfs(false, function(err)
        {
            if(err)
                console.log(err);
            else
                console.log("Saved");
        });

    });

    printf("Saved: %s\n", text);
}

EMSCRIPTEN_KEEPALIVE
void read_file()
{
    FILE *file = fopen("/data/output.txt", "r");

    if(!file)
    {
        printf("No file\n");
        return;
    }

    char buffer[256];

    printf("----- File Contents -----\n");

    while(fgets(buffer, sizeof(buffer), file))
    {
        printf("%s", buffer);
    }

    printf("-------------------------\n");

    fclose(file);
}

}