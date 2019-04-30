SELECT * FROM products;

-- Add data to the table
INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ('Ibuprophen', 'Pharmacy', 4.95, 389),
				('Band Aid', 'Pharmacy', 3.25, 550),
				('Farmasi Shampoo', 'Cosmetics', 25.75, 350),
				('Farmasi Conditioner', 'Cosmetics', 20.25, 400),
                ('Pampers Baby Wipes', 'Children', 8.50, 511),
                ('Huggies Diapers', 'Children', 7.99, 435),
                ('Purina Cat Chow', 'Pet', 7.25, 157),
                ('Whiskas Cat Milk', 'Pet', 1.61, 200),
                ('Yoga Mat', 'Sports', 8.99, 175),
				('10lb Dumb bell', 'Sports', 10.25, 90),
                ('Women Jackest', 'Clothing', 54.99, 120),
				('Adidas Shorts', 'Clothing', 22.99, 250)
                ;