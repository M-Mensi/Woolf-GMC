-- 1. Display all the data of customers
SELECT *
FROM Customer;

-- 2. Display the product_name and category for products which their price is between 5000 and 10000
SELECT product_name, category
FROM Product
WHERE Price BETWEEN 5000 AND 10000;

-- 3. Display all the data of products sorted in descending order of price.
SELECT *
FROM Product
ORDER BY Price DESC;

-- 4. Display the total number of orders, the average amount, the highest total amount and the lower total amount
SELECT
    COUNT(*) AS Total_Orders,
    AVG(total_amount) AS Average_Amount,
    MAX(total_amount) AS Highest_Amount,
    MIN(total_amount) AS Lowest_Amount
FROM Orders;

-- 5. For each product_id, display the number of orders
SELECT
    Product_id,
    COUNT(*) AS Number_of_Orders
FROM Orders
GROUP BY Product_id;

-- 6. Display the customer_id which has more than 2 orders
SELECT
    Customer_id
FROM Orders
GROUP BY Customer_id
HAVING COUNT(Product_id) > 2;

-- 7. For each month of the 2020 year, display the number of orders
SELECT
    -- Format date to year-month string for grouping and readability
    TO_CHAR(OrderDate, 'YYYY-MM') AS Order_Month, 
    COUNT(*) AS Number_of_Orders
FROM Orders
WHERE
    EXTRACT(YEAR FROM OrderDate) = 2020 -- Filter for the year 2020
GROUP BY
    Order_Month
ORDER BY
    Order_Month;

-- 8. For each order, display the product_name, the customer_name and the date of the order
SELECT
    C.customer_Name,
    P.product_name,
    O.OrderDate
FROM Orders O
INNER JOIN Customer C ON O.Customer_id = C.Customer_id
INNER JOIN Product P ON O.Product_id = P.Product_id;

-- 9. Display all the orders made three months ago

SELECT *
FROM Orders
WHERE
    OrderDate >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -3)
    AND OrderDate < ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -2);
-- i'm not sure about this one

-- 10. Display customers (customer_id) who have never ordered a product
SELECT
    C.Customer_id,
    C.customer_Name
FROM Customer C
LEFT JOIN Orders O ON C.Customer_id = O.Customer_id
WHERE O.Customer_id IS NULL;