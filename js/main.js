var recipes={};
var recipes_json_path = "./data/recipes.json";
var image_path = "./data/pics/";
var image_suffix = ".png";
var missing_image = "missing_image";

function imgError(image) {
    image.onerror = "";
    image.src = image_path + missing_image + image_suffix;
    return true;
}

function parseJson() {
    var request = new XMLHttpRequest();
    request.open("GET", recipes_json_path, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function init() {
    if(!recipes[0]){
	var recipeObject = parseJson();
	for(var i=0;i<recipeObject.recipe.length;i++) {
	    var item = recipeObject.recipe[i];
	    var name = item.name;
	    var ingredients= item.ingredients;
	    var craft_need = item.craft_need;
	    if (name && ingredients)
	    {
		recipes[name] = createItem(name,ingredients,craft_need);
	    }
	}
    }
    initItemDropdownList();
    initItemBrowseList();
    //populate first item information
    selectItem();
}

function createItem(name,ingredients,craft_need) {
    var displayItem = new Object();
    displayItem.name = name;
    displayItem.craft_need= craft_need;
    displayItem.composition = decouple(ingredients);
    return displayItem;
}

function decouple(rawIngredientString){
    if (rawIngredientString != null && rawIngredientString != "undefined"){
	var parts = {};
	var rawIngredients = rawIngredientString.split(",");
	for (var i = 0; i < rawIngredients.length; i++) {
	    var piece = rawIngredients[i].split("-");
	    var item = piece[0];
	    var position = piece[1];
	    parts[position] = item;
	}
	return parts;
    }
}

function initItemDropdownList(){
    var select = document.getElementById("items");
    for(var item in recipes)
    {
	var itemOption = document.createElement("option");
	itemOption.text = itemOption.value = recipes[item].name;
	select.add(itemOption);
    }
}

function initItemBrowseList(){
    var img_elements = "";
    for (var item in recipes)
    {
	var name = recipes[item].name;
	var img_src = image_path + name + image_suffix;
	var img_element = "<img src=\"" + img_src + "\" title=\"" + name + "\" onerror=\"imgError(this);\" onclick=\"browseItem(this)\">";
	img_elements = img_elements + img_element;
    }
    document.getElementById("list").innerHTML = img_elements;
}

function selectItem(){
    var select = document.getElementById("items");
    var selectedItemKey = select[select.selectedIndex].value;
    populateItem(selectedItemKey);
}

function browseItem(img){
    var name = img.title;
    var ddl = document.getElementById("items");
    for (var i = 0; i < ddl.options.length; i++) {
	if (ddl.options[i].value === name) {
            ddl.selectedIndex = i;
            break;
	}
    }
    //trigger item selecting
    selectItem();
}

function populateItem(key){
    var item = recipes[key];
    var name = item.name;

    //populate name
    document.getElementById("name").innerHTML = name;

    //populate icon
    var img_element = document.getElementById("icon").children[0];
    var img_path = image_path + name + image_suffix;
    img_element.setAttribute("src", img_path);
    img_element.setAttribute("alt", name);

    //populate craft station
    var craft_station = "none";
    if (item.craft_need){
        craft_station = item.craft_need;
    }
    document.getElementById("craft_station").innerHTML = "craft station: " + craft_station;

    //populate composition
    var compositionString = "";
    for (var i = 0; i < 9; i++) {
	var compositionItem = item.composition[i];
	var img_compo = "";
	if (compositionItem) {
	    var img_path_compo = image_path + compositionItem + image_suffix;
	    img_compo = "<img src=\"" + img_path_compo + "\" alt=\"" + compositionItem + "\" title=\"" + compositionItem + "\">";
	}
	compositionString = compositionString + "<div class=\"compo\">" + img_compo + "</div>";
    }
    document.getElementById("composition").innerHTML = compositionString;
}
