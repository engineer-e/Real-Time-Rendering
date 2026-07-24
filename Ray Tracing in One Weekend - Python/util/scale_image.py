from PIL import Image
import matplotlib.pyplot as plt

def scale(img,zoom):
 scale = zoom
 zoomed = img.resize(
    (img.width * scale, img.height * scale),
    Image.NEAREST
 )
 plt.imshow(zoomed)
 plt.axis("off")
 plt.show()