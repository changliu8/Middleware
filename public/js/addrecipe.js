let descriptors = ["Sweet", "Spicy", "BBQ", "Braised", "Deconstructed", "Broiled", "Boiled", "Flambeed", "Raw", "Smoked", "Butterflied", "Cured", "Grilled", "Poached"];
let proteins = ["Chicken", "Beef", "Lobster", "Shrimp", "Crab", "Turkey", "Duck", "Tofu", "Chickpeas", "Lentils", "Peanuts", "Kangaroo", "Human", "Goose", "Fish", "Pork", "Eggs", "Deer"];
let accompany = ["Broccoli", "Carrots", "Peas", "Potato", "Kale", "Banana", "Artichoke", "Asparagus", "Beans", "Broccoli", "Brussel Sprouts", "Celery", "Melon", "Mushrooms", "Pumpkin"];
let spices = ["Salt", "Pepper", "Basil", "Thyme", "Sage", "Cumin"];
let mealDescriptors = ["tasty", "mediocre", "very good", "boring", "exciting", "delicious", "easy", "ridiculously complex"];
let units = ["Tbsp", "Tsp", "Cup", "Liter", "Grams"]

let recipe = {ingredients: []};

//Generates a random recipe on the page
//Fills in the input fields with the recipes information
function genRandom(){
	recipe = {ingredients: []};
	let descriptor = descriptors[Math.floor(Math.random()*descriptors.length)];
	let protein = proteins[Math.floor(Math.random()*proteins.length)];
	let acc = accompany[Math.floor(Math.random()*accompany.length)];
	let mealDes = mealDescriptors[Math.floor(Math.random()*mealDescriptors.length)];
	
	document.getElementById("recipename").value = descriptor + " " + protein + " with " + acc;
	document.getElementById("preptime").value = Math.floor(Math.random()*100);
	document.getElementById("cooktime").value = Math.floor(Math.random()*100);
	document.getElementById("description").value = "A " + mealDes + " recipe using " + protein + " and " + acc;
	
	let ingName = protein;
	let ingUnit = units[Math.floor(Math.random()*units.length)];
	let ingAmount = Math.floor(Math.random()*15)+1;
	recipe.ingredients.push({name: ingName, unit: ingUnit, amount: ingAmount});
	
	ingName = acc;
	ingUnit = units[Math.floor(Math.random()*units.length)];
	ingAmount = Math.floor(Math.random()*15)+1;
	recipe.ingredients.push({name: ingName, unit: ingUnit, amount: ingAmount});
		
	let numIngredients = Math.floor(Math.random()*5);
	let usedIngredients = []
	while(usedIngredients.length < numIngredients){
		ingName = spices[Math.floor(Math.random()*spices.length)];
		if(usedIngredients.includes(ingName)){
			continue;
		}
		ingUnit = units[Math.floor(Math.random()*units.length)];
		ingAmount = Math.floor(Math.random()*15)+1;
		recipe.ingredients.push({name: ingName, unit: ingUnit, amount: ingAmount});
		usedIngredients.push(ingName);
	}

	updateIngredients();
}


function addIngredient(){
	let name = document.getElementById("ingredient").value;
	let amount = document.getElementById("amount").value;
	let unit = document.getElementById("unit").value;
	let ingredient = {name, amount, unit};
	recipe.ingredients.push(ingredient);
	updateIngredients();
}

function updateIngredients(){
	let innerHTML = "";
	recipe.ingredients.forEach(ingredient => {
		innerHTML += ingredient.amount + " " + ingredient.unit + " " + ingredient.name + "<br>";
	});
	document.getElementById("ingredients").innerHTML = innerHTML;
}

function submit(){
	recipe.name = document.getElementById("recipename").value;
	recipe.preptime = document.getElementById("preptime").value;
	recipe.cooktime = document.getElementById("cooktime").value;
	recipe.description = document.getElementById("description").value;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("recipe saved");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/recipes`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(recipe));
}
