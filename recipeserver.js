
//Database to store all recipe data
//This will give you 3 recipes to start with
const pug = require('pug');
const Rectypes = pug.compileFile('views/pages/types.pug')
const Rectype = pug.compileFile('views/pages/type.pug')
function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

const { v4: uuidv4 } = require('uuid');

let database = {
	"b0e347d5-9428-48e5-a277-2ec114fc05a0":{
		"ingredients":
		[
			{"name":"Crab","unit":"Tsp","amount":3},
			{"name":"Peas","unit":"Cup","amount":12},
			{"name":"Basil","unit":"Tbsp","amount":10},
			{"name":"Cumin","unit":"Liter","amount":3},
			{"name":"Salt","unit":"Tbsp","amount":1}
		],
		
		"name":"Boiled Crab with Peas",
		"preptime":"13",
		"cooktime":"78",
		"description":"A boring recipe using Crab and Peas",
		"id":"b0e347d5-9428-48e5-a277-2ec114fc05a0"
	},
	"04dcde4f-b1de-4f2b-b169-969594c82278":{
		"ingredients":
		[
			{"name":"Peanuts","unit":"Liter","amount":10},
			{"name":"Artichoke","unit":"Tsp","amount":3},
			{"name":"Basil","unit":"Cup","amount":11},
			{"name":"Sage","unit":"Grams","amount":13},
			{"name":"Pepper","unit":"Cup","amount":1}
		],
		
		"name":"Boiled Peanuts with Artichoke",
		"preptime":"73",
		"cooktime":"74",
		"description":"A exciting recipe using Peanuts and Artichoke",
		"id":"04dcde4f-b1de-4f2b-b169-969594c82278"
	},
	"b45bb7f9-51bc-47de-a4c3-fa564a241c27":{
		"ingredients":
		[
			{"name":"Lobster","unit":"Tsp","amount":14},
			{"name":"Brussel Sprouts","unit":"Liter","amount":14},
			{"name":"Sage","unit":"Tbsp","amount":3},
			{"name":"Thyme","unit":"Tbsp","amount":12},
			{"name":"Pepper","unit":"Tsp","amount":10},
			{"name":"Cumin","unit":"Tbsp","amount":11}
		],
			
		"name":"Spicy Lobster with Brussel Sprouts",
		"preptime":"86",
		"cooktime":"19",
		"description":"A tasty recipe using Lobster and Brussel Sprouts",
		"id":"b45bb7f9-51bc-47de-a4c3-fa564a241c27"
	}
}

function parseBody(req, res, next){
	//Could also check Content-Type header
	if(req.method === "POST"){
		console.log("Parsing body");
		let body = ""
		req.on('data', (chunk) => {
			body += chunk;
		})
		req.on('end', () => {
			var num = uuidv4()
			console.log("Received body: " + body);
			req.body = body;
			var tmp = JSON.parse(body)
			console.log("123 " + tmp.description)
			tmp["id"] = num;
			database[num] = tmp;
			console.log(database[num])
			console.log(database)
			//When we are finished, call the next middleware
			next();
		})
	}
	else if(req.method === "GET"){
		if(req.url==="/recipes"){
			let content = Rectypes({database});
			res.statusCode = 200;
			res.end(content);
			return;
		}
		else if(req.url.startsWith("/recipes/:")){
			let pid = req.url.slice(10);
			found = (pid in database)
			var tmp = database[pid];
			try{
				if(found){
					console.log("Found: " + pid);
					let content = Rectype({recipe: tmp});
					res.statusCode = 200;
					res.end(content);
					return;
				}else{
					send404(res);
					return;
				}
			}catch(err){
				console.log(err);
				console.log("Exception casting pid");
				send404(res);
				return;
			}


		}
	}

	else{
		//If not a POST, then go to next middleware
		next();
	}
}



const express = require('express');
let app = express();
var bodyParser = require('body-parser');

app.use(express.static("public"));


//Start adding route handlers here

app.use(parseBody);


app.listen(3000);
console.log("Server listening at http://localhost:3000");