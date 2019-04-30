// Dependencies
var mysql = require('mysql'); // mysql
var inquirer = require('inquirer'); // Inquirer
var Table = require('cli-table'); //For Table formatting
var chalk = require('chalk'); //For font color and properties

//Create the connection for the sql database
var connection = mysql.createConnection({
	host: 'localhost',
    port: 3306,
    user: 'root',
    password: '*****',
    database: 'Bamazon_DB'
}); 
//Connect to the mysql server and sql database
connection.connect(function(err){
    if (err) throw err;
    welcome();
});

//Function that presents welcome statement the first time
function welcome(){
    console.log(chalk.yellow("\n\t**=============** WELCOME TO BAMAZON **=============**"));
    bamazon()
}
//Function to show list of products available for purchase

function bamazon() {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;

		// Table formatting using Cli-table package
		var table = new Table({
			head: [
				'Product ID',
				'Product Name',
				'Department Name',
				'Price',
				'Quantity'
			],
			colWidths: [ 12, 30, 15, 10, 10 ]
		});
        
        console.log(chalk.bold("\n\tBelow is a list of items you can purchase from our store"));
        console.log("\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
		// Set the table headings and Loop through entire inventory
		for (var i = 0; i < res.length; i++) {
			table.push([
				res[i].id,
				res[i].product_name,
				res[i].department_name,
				parseFloat(res[i].price).toFixed(2),
				res[i].stock_quantity
			]);
        }

       

        console.log(table.toString());  // END Display Inventory
        console.log ("");
        buyProducts()

        })
    }   
    
        
//Function to ask user what product and quantity they want to purchase
function buyProducts(){
    inquirer.prompt([
        {
            name:"chosenItem",
            type: "input",
            message: chalk.yellow("Please enter the Item ID of the product you would like to purchase?"), 
            validate: function(value){
                if (value!=="" && isNaN(value) == false &&  value<25 ) {
                    return true;
                } else {
                    return chalk.bgRed("**ERROR** Invalid ID, enter a valid ID from the list");
                }
            }
        },
        {
            name: "chosenQty",
            type: "input",
            message: chalk.yellow("How much quantity would you like to purchase?"), 
            validate: function(value){
                if (value!=="" && isNaN(value) == false) {
                    return true;
                } else {
                    return chalk.bgRed("**ERROR** Enter a number");
                }
            }
        }
    ])
    .then(function(answer){
        var query = "SELECT id,product_name, stock_quantity, price FROM products WHERE id = ?";
        connection.query(query, [answer.chosenItem], function(err, res){
            for (var i = 0; i <res.length; i++) {
                console.log(chalk.green.bold("\nYour product choice is: ") + chalk.white.bold(res[i].product_name) + " " + chalk.green.bold("for a quantity of") + " " + chalk.white.bold(answer.chosenQty));
                console.log(chalk.green.bold("\nWe currently have a quantity of ") + chalk.white.bold(res[i].stock_quantity) + " " + chalk.green.bold("for this product"));
                if(res[i].stock_quantity <answer.chosenQty){
                    console.log (chalk.bgRed("\nSorry there is not enough quantity of this product in stock.\n"));
                    nextOption();
                }
                else {
                    console.log(chalk.inverse("\n\t*****************************************************"));
                    console.log(chalk.inverse("\tYour order has been processed.Thank you for Shopping!"));
                    console.log(chalk.inverse("\t*****************************************************"));
                    console.log (chalk.inverse.bold("\tYou purchased" + " " + chalk.underline(res[i].product_name) + " " + "with quantity of" + " " + chalk.underline(answer.chosenQty) + "."));
                    var purchaseTotal = res[i].price * answer.chosenQty;
                    console.log(chalk.inverse.bold("\tYour total COST is $" + purchaseTotal + "                             "));
                    console.log(chalk.inverse.bold("\t*****************************************************"));
                    var newQty = res[i].stock_quantity - answer.chosenQty;
                    console.log (chalk.green("\nWe now have a quantity of " + newQty + "  remaining for this product\n"));
                    //Updating stock quantity in the database
                    connection.query("UPDATE products SET stock_quantity = " + newQty +" WHERE id = " + res[i].id, function(err, res){
                    nextOption();
                    });
                }
            }
        })
    })
}

//Function for prompts to buy more or quit
function nextOption(){
    inquirer.prompt([
        {
            name: "continue",
            type: "confirm",
            message: chalk.green("Do you want to puchase another product?")
        }
    ])
    .then(function(response){
        if (response.continue == true){
            console.log("You want to continue shopping");
            bamazon();
        }
        else{
            console.log ("\n\tThank you for chosing us!");
            console.log ("\n\t\tBYE BYE!");
            connection.end();
        }
    })

} 
