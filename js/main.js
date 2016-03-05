var recipes={};

function parseJson() {
    var request = new XMLHttpRequest();
    request.open("GET", "./data/recipes.json", false);
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

function test2(){
    document.getElementById("test").innerHTML = recipes["door_iron"].composition[8];
}
