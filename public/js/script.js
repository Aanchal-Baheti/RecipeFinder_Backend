
let addIngredientsButton = document.getElementById('addIngredientsButton');
let ingredientsList = document.querySelector('.ingredientsList');
let ingredeintsDiv = document.querySelectorAll('.ingredeintsDiv')[0];

addIngredientsButton.addEventListener('click', function(){
    let newIngredients = ingredeintsDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientsList.appendChild(newIngredients);
});