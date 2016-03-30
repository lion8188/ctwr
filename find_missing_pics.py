import json
from xml.dom import minidom
from PIL import Image

recipes_file = "./data/recipes.json"
image_file = "./picgenerator/common.xml"
raw_images_dir = "./picgenerator/raw_pics"
new_images_dir = "./data/pics"
image_suffix = ".png"

def parseImagePath(path):
    path_parts = path.split("\\")
    image_name = path_parts[len(path_parts) - 1]
    if image_name.endswith(".png"):
        image_name = image_name[:-4]
    return image_name

#build image key value pairs
image_dict = {}
imagedoc = minidom.parse(image_file)
commonlist = imagedoc.getElementsByTagName("list")
for commonImage in commonlist:
    commonImageName = commonImage.attributes["name"].value
    imageList = commonImage.getElementsByTagName("image")
    print "image list size:", len(imageList)
    for image in imageList:
        path = image.attributes["path"].value
        if path:
            imageName = parseImagePath(path)
            x = image.attributes["x"].value
            y = image.attributes["y"].value
            w = image.attributes["w"].value
            h = image.attributes["h"].value
            # array structure: imageFileName, x, y, w, h
            imageObject = [commonImageName, x, y, w, h]
            image_dict[imageName] = imageObject

#iterate item names of recipes.json, find missing images
with open(recipes_file) as recipes_file:
    recipes_data = json.load(recipes_file)
print "items size:" , len(recipes_data["recipe"])

f = open("missing_images.txt", "w")
count = 0
for recipe in recipes_data["recipe"]:
    item_name = recipe["name"]
    item_image = image_dict.get(item_name)
    if item_image is None:
        f.write(item_name + "\n")
        count = count + 1
f.write("total missing images: %d" % count)
f.close()
