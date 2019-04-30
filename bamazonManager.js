// Dependencies

var Table = require('cli-table');
var mysql = require('mysql');
var inquirer = require('inquirer');
var chalk = require("chalk");

//Connect to SQL database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

   
    user: "root",

    
    password: "esad",
    database: "Bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

//Inquirer introduction

function start() {

    inquirer.prompt([{

        type: "list",
        name: "choiceList",
        message: "Welcome Manager. What would you like to review?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]

    }]).then((answer) => {
            switch (answer.choiceList) {
                case "View Products For Sale":
                        inventoryView();
                break;
                case "View Low Inventory" :
                        lowInventory();
                break;
                case  "Add To Inventory" :
                        addInventory();
                break;
                case "Add New Product" :
                        addProduct();
                break;

        }
    });
}

//View Inventory function

function inventoryView() {

   
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

    listInventory();

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    function listInventory() {

        //Variable creation from DB connection

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = parseFloat(res[i].price).toFixed(2),
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
            console.log("");
            console.log("====================================================== Current Bamazon Inventory ======================================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            nextOption();
        });
    }
}

//=================================View Low Inventory===============================

//Connect to database to show any inventory with less than 5 in stock quantity

function lowInventory() {

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

    listLowInventory();

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    function listLowInventory() {

        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                //check if any of the stock_quantity equals 5 or less

                if (res[i].stock_quantity <= 5) {

                    var itemId = res[i].id,
                        productName = res[i].product_name,
                        departmentName = res[i].department_name,
                        price = parseFloat(res[i].price).toFixed(2),
                        stockQuantity = res[i].stock_quantity;

                    table.push(
                        [itemId, productName, departmentName, price, stockQuantity]
                    );
                }
            }
            console.log("");
            console.log("============================================= Low Bamazon Inventory (5 or Less in Stock) ===============================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            nextOption();
        });
    }
}

//Add Inventory function

function addInventory(){
    inquirer.prompt([
        {
            name:"chosenItem",
            type: "input",
            message: chalk.green("Please enter the Item ID of the product you would like to add?"), 
            validate: function(value){
                if (value!=="" && isNaN(value) == false &&  value!== "id" ) {
                    return true;
                } else {
                    return chalk.bgRed("**ERROR** Invalid ID, enter a valid ID from the list");
                }
            }
        },
        {
            name: "chosenQty",
            type: "number",
            message: chalk.green("How much quantity would you like to add?"), 
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
                    console.log (chalk.inverse.bold("\tInventory of" + " " + chalk.underline(res[i].product_name) + " " + "has been increased" + " " + chalk.underline(answer.chosenQty) + "quantity!"));
                    console.log(chalk.inverse.bold("\t*****************************************************"));
                    var newQty = res[i].stock_quantity + answer.chosenQty;
                    console.log (chalk.green("\nInventory now has a quantity of " + newQty + "  remaining for this product\n"));
                    //Updating stock quantity in the database
                    connection.query("UPDATE products SET stock_quantity = " + newQty +" WHERE id = " + res[i].id, function(err, res){
                    nextOption();
                    });
            }
        });
    });           
}


//Add New Product function

function addProduct() {

//ask user to fill in all necessary information to fill columns in table

    inquirer.prompt([{

            type: "input",
            name: "inputName",
            message: "Please enter the item name of the new product.",
        },
        {
            type: "input",
            name: "inputDepartment",
            message: "Please enter which department name of which the new product belongs.",
        },
        {
            type: "input",
            name: "inputPrice",
            message: "Please enter the price of the new product (0.00).",
        },
        {
            type: "input",
            name: "inputStock",
            message: "Please enter the stock quantity of the new product.",
        }

    ]).then((answers) => {

      //connect to database, insert column data with input from user

      connection.query("INSERT INTO products SET ?", {
        product_name: answers.inputName,
        department_name: answers.inputDepartment,
        price: answers.inputPrice,
        stock_quantity: answers.inputStock
      }, function(err, res) {});
      nextOption();
    });
  }

  //Function for prompts to buy more or quit
function nextOption(){
    inquirer.prompt([
        {
            name: "continue",
            type: "confirm",
            message: chalk.green("Do you want to make another changes?")
        }
    ])
    .then(function(response){
        if (response.continue == true){
            console.log("You want to continue changes");
            start();
        }
        else{
            console.log ("\n\tSee you next time!");
            connection.end();
        }
    })

} 