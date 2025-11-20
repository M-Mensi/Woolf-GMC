-- 1. Insert data into the Customer table
INSERT INTO Customer (Customer_id, Customer_Name, Customer_Tel) VALUES ('C01', 'ALI', 71321009);
INSERT INTO Customer (Customer_id, Customer_Name, Customer_Tel) VALUES ('C02', 'ASMA', 77345823);

-- 2. Insert data into the Product table
INSERT INTO Product (Product_id, Product_Name, Category, Price) VALUES ('P01', 'Samsung Galaxy S20', 'Smartphone', 3299);
INSERT INTO Product (Product_id, Product_Name, Category, Price) VALUES ('P02', 'ASUS Notebook', 'PC', 4599);

-- 3. Insert data into the Orders table
INSERT INTO Orders (Customer_id, Product_id, OrderDate, Quantity, Total_amount)
VALUES ('C01', 'P02', NULL, 2, 9198);

INSERT INTO Orders (Customer_id, Product_id, OrderDate, Quantity, Total_amount)
VALUES ('C02', 'P01', TO_DATE('28/05/2020', 'DD/MM/YYYY'), 1, 3299);