import json
from xml.dom import minidom
from PIL import Image

raw_images_dir = "./picgenerator/raw_pics"
new_images_dir = "./data/pics"
image_suffix = ".png"

image_file = raw_input("Please enter image file name (without file extension): ")
x = int(raw_input("Please enter x: "))
y = int(raw_input("Please enter y: "))
w = int(raw_input("Please enter w: "))
h = int(raw_input("Please enter h: "))
new_image = raw_input("Please enter new image file name (without file extension): ")

#create a new image
im = Image.open(raw_images_dir + "/" + image_file + image_suffix)
icon = im.crop((x, y, x + w, y + h))
if icon is not None:
    width, height = icon.size
    if width > 50 or height > 50:
        size = 50, 50
        icon.thumbnail(size, Image.ANTIALIAS)
    new_image_path = new_images_dir + "/" + new_image + image_suffix
    icon.save(new_image_path)
    print "Create new image:", new_image_path
