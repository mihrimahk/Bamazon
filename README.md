# BAMAZON
- - -

## ABOUT THE BAMAZON

Bamazon is an Amazon-like CLI storefront built with mySQL, NODE.js and Inquirer NPM.Output styled with Colors and console.table NPM's.

The app can take in orders from customers, calculate sales price and deplete stock from the store's inventory.User validation prevents customers from buying more stock than is available.

Managers can view the entire store’s inventory , view low inventory items, reorder any items, and create new products to sell.

- - -

## HOW TO USE BAMAZON

 ** Bamazon Customer

After running "bamazonCustomer.js",  first displays all of the items available for sale. This cli-table include the ids, names, and prices of products for sale.
The app  then prompt users with two messages.
*The first asks them the ID of the product they would like to buy.
*The second message  asks  how many units of the product they would like to buy.

After the customer has placed the order, this  application checks if the store has enough of the product to meet the customer's request.

If not, the app  log a phrase like Insufficient quantity!, and then prevent the order from going through.

However, if the store does have enough of the product, it fulfill the customer's order.
    *This means updating the SQL database to reflect the remaining quantity.
    *Once the update goes through, show the customer the total cost of their purchase.

    

 ** Bamazon Manager

 After running  "bamazonManager.js." , it gives  the below:


First this app list a set of menu options:
*View Products for Sale
*View Low Inventory
*Add to Inventory
*Add New Product
**If a manager selects View Products for Sale, the app list every available item: the item IDs, names, prices, and quantities.
**If a manager selects View Low Inventory, then it  list all items with an inventory count lower than five.
**If a manager selects Add to Inventory, this app  displays a prompt that will let the manager "add more" of any item currently in the store.
**If a manager selects Add New Product, it allow the manager to add a completely new product to the store.




## TECHNOLOGIES USED
* Javascript
* Nodejs
* MySQL
* Node packages:
    * MySQL
    * Inquirer
    * Cli-table
    * Chalk
* Git
* GitHub