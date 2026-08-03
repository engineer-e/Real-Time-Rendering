#include <stdio.h>
#include <iostream>
#include <string>
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

        FS.syncfs(true,function(err)
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
    std::cout << "Slider Value = "
              << value
              << std::endl;
}



EMSCRIPTEN_KEEPALIVE
void set_checkbox_value(int checked)
{
    if(checked)
        std::cout << "Checkbox ON"
                  << std::endl;
    else
        std::cout << "Checkbox OFF"
                  << std::endl;
}




EMSCRIPTEN_KEEPALIVE
void button_click(const char* message)
{
    std::cout << "Button pressed"
              << std::endl;


    std::cout << "Message from HTML: "
              << message
              << std::endl;
}





EMSCRIPTEN_KEEPALIVE
void textarea_input(const char* text)
{
    std::cout << "Textarea:"
              << std::endl;


    std::cout << text
              << std::endl;
}






// Save browser selected file into /data/output.txt
EMSCRIPTEN_KEEPALIVE
void import_file(const char* text)
{

    FILE *file =
    fopen("/data/output.txt","w");


    if(!file)
    {
        std::cout<<"Cannot create file"
                 <<std::endl;
        return;
    }


    fprintf(file,"%s",text);


    fclose(file);



    EM_ASM({

        FS.syncfs(false,function(err)
        {
            if(err)
                console.log(err);
            else
                console.log("Imported file saved");
        });

    });



    std::cout<<"File imported successfully"
             <<std::endl;

}






// Existing append write
EMSCRIPTEN_KEEPALIVE
void write_file(const char* text)
{

    FILE *file =
    fopen("/data/output.txt","a");


    if(!file)
    {
        std::cout<<"Cannot open file"
                 <<std::endl;
        return;
    }


    fprintf(file,"%s\n",text);


    fclose(file);



    EM_ASM({

        FS.syncfs(false,function(err)
        {
            if(err)
                console.log(err);
            else
                console.log("Saved");
        });

    });


    std::cout<<"Saved: "
             <<text
             <<std::endl;

}






EMSCRIPTEN_KEEPALIVE
void read_file()
{

    FILE *file =
    fopen("/data/output.txt","r");


    if(!file)
    {
        std::cout<<"No file"
                 <<std::endl;
        return;
    }


    char buffer[256];


    std::cout<<"------ FILE ------"
             <<std::endl;


    while(fgets(buffer,sizeof(buffer),file))
    {
        std::cout<<buffer;
    }


    std::cout<<"------------------"
             <<std::endl;


    fclose(file);

}






// Export file content to JavaScript
EMSCRIPTEN_KEEPALIVE
const char* export_file()
{

    static std::string data;


    data.clear();



    FILE *file =
    fopen("/data/output.txt","r");


    if(!file)
    {
        return "";
    }



    char buffer[256];


    while(fgets(buffer,sizeof(buffer),file))
    {
        data += buffer;
    }



    fclose(file);



    return data.c_str();

}



}