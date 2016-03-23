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

#iterate item names of recipes.json, create image for them
with open(recipes_file) as recipes_file:
    recipes_data = json.load(recipes_file)
print "items size:" , len(recipes_data["recipe"])
for recipe in recipes_data["recipe"]:
    item_name = recipe["name"]
    item_image = image_dict.get(item_name)
    if item_image is not None:
        print item_image
        #create a new image
        im = Image.open(raw_images_dir + "/" + item_image[0] + image_suffix)
        x = int(item_image[1])
        y = int(item_image[2])
        w = int(item_image[3])
        h = int(item_image[4])
        icon = im.crop((x, y, x + w, y + h))
        if icon is not None:
            #newImage = Image.new(icon.mode, (w, h), "white")
            #newImage.paste(icon)
            #resize here?
            icon.save(new_images_dir + "/" + item_name + image_suffix)
    else:
        print "image not found:", item_name
