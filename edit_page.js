let valor = window.location.search

//creates the instance
const urlParams = new URLSearchParams(valor);

//Accesses to the value
var recipeId = urlParams.get('id');

console.log(recipeId);
