from PIL import Image
import matplotlib.pyplot as plt

def image_viewer(filename):
    img = Image.open(filename)
    return img
