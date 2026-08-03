#include <stdio.h>

int main()
{
    FILE *file = fopen("test/hello_world_file.txt", "rb");

    if (!file)
    {
        printf("cannot open file\n");
        return 1;
    }

    int c;

    while ((c = fgetc(file)) != EOF)
    {
        putchar(c);
    }

    fclose(file);

    fflush(stdout);

    return 0;
}