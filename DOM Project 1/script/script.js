
// Increasing the quantity of a product
function addQuantity(product){
    let quantity = product.textContent;
    let quantityValue = parseInt(quantity);
    quantityValue++;
    product.textContent = quantityValue;
    console.log(quantityValue);
    UpdateTotal();
}

// Decreasing the quantity of a product
function removeQuantity(product){
    let quantity = product.textContent;
    let quantityValue = parseInt(quantity);
    if(quantityValue > 0){
        quantityValue--;
        product.textContent = quantityValue;
    }
    console.log(quantityValue);
    UpdateTotal();
}

// Deleting the entire product card
function deleteProduct(product){
    product.remove();
    UpdateTotal();
    console.log("Product deleted:", product.id);
}


// Liking a product
function likeProduct(heartIcon) {
    heartIcon.classList.toggle("liked");
    if (heartIcon.classList.contains("liked")) {
        heartIcon.style.color = "red";
        console.log("Product liked");
    } else {
        heartIcon.style.color = "black";
        console.log("Product unliked");
    }
}


// Updating the total price of the shopping cart
function UpdateTotal(){
    let prices = document.getElementsByClassName('unit-price');
    console.log("Prices found:", prices);
    let quantities = document.getElementsByClassName('quantity');
    console.log("Quantities found:", quantities);
    let sum = 0;
    for(let i = 0; i < prices.length; i++){
        console.log(`Price: ${prices[i].textContent}, Quantity: ${quantities[i].textContent}`);
        sum += parseFloat(prices[i].textContent) * parseInt(quantities[i].textContent);
        console.log(`Subtotal after item ${i + 1}:`, sum);
    }
    document.getElementById('total-price').textContent = sum + " $";
    console.log("Total price updated:", sum);
}