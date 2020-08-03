
//Database to store all recipe data
//This will give you 3 recipes to start with
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const Rectypes = pug.compileFile('views/pages/types.pug')
const Rectype = pug.compileFile('views/pages/type.pug')
function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

const { v4: uuidv4 } = require('uuid');

let database = {}


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
			var tmpobj = {}
			console.log("Received body: " + body);
			req.body = body;
			var tmp = JSON.parse(body)
			tmp["id"] = num;
			tmpobj[num] = tmp;
			var fname = "./recipes/"+num + ".json"
			var str = JSON.stringify(tmpobj)
			fs.writeFile(fname,str,function(err){
				if(err){
					console.log("?")
				}
				else{console.log("!")}
			});

			//When we are finished, call the next middleware
			next();
		})
	}
	else if(req.method === "GET"){
		if(req.url==="/recipes"){
			/*
			let content = Rectypes({database});
			res.statusCode = 200;
			res.end(content);
			return;
			*/
			var files = fs.readdirSync('recipes');
			files.forEach(file => {
				var tmpname = "./recipes/"+ file
				var tmpdata = require(tmpname);
				var tmpvalue = Object.values(tmpdata)
				var tmpstr = JSON.stringify(tmpvalue)
				var finishstr = tmpstr.substring(1,tmpstr.length-1)
				var finishvalue = JSON.parse(finishstr)
				database[Object.keys(tmpdata)] = finishvalue
			});
			
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