-- 1. Create the Customer table
CREATE TABLE Customer (
    Customer_id   VARCHAR2(20)   PRIMARY KEY,
    Customer_Name VARCHAR2(20)   NOT NULL,
    Customer_Tel  NUMBER
);

-- 2. Create the Product table
CREATE TABLE Product (
    Product_id    VARCHAR2(20)   PRIMARY KEY,
    Product_Name  VARCHAR2(20)   NOT NULL,
    Price         NUMBER         CHECK (Price > 0)
);

-- 3. Create the Orders table
-- we will use the two FKs as the composite PK.
CREATE TABLE Orders (
    Customer_id   VARCHAR2(20)   NOT NULL,
    Product_id    VARCHAR2(20)   NOT NULL,
    Quantity      NUMBER,
    Total_amount  NUMBER,
    -- Define the composite primary key
    CONSTRAINT PK_Orders PRIMARY KEY (Customer_id, Product_id),
    -- Define the Foreign Key constraints
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (Customer_id)
        REFERENCES Customer(Customer_id),
    CONSTRAINT FK_Orders_Product FOREIGN KEY (Product_id)
        REFERENCES Product(Product_id)
);

-- 4. Add a column Category (VARCHAR2(20)) to the PRODUCT table.
ALTER TABLE Product
ADD Category VARCHAR2(20);

-- 5. Add a column OrderDate (DATE) to the ORDERS table which has SYSDATE as a default value.
ALTER TABLE Orders
ADD OrderDate DATE DEFAULT SYSDATE;