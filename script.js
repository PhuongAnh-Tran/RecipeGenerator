// Add ingredient to the list
function addIngredient() {
    const input = document.getElementById('ingredientInput');
    const list = document.getElementById('ingredientList');
    const generateBtn = document.getElementById('generateRecipeBtn');
  
    if (input.value.trim() !== '') {
      const listItem = document.createElement('li');
      listItem.textContent = input.value + ' ';
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.style.marginLeft = '5px';
      removeBtn.onclick = function() {
        list.removeChild(listItem);
      };
      listItem.appendChild(removeBtn);
      list.appendChild(listItem);
      input.value = '';
      generateBtn.style.display = 'block';
    }
  }
  
  // Allow adding ingredient by pressing Enter
  document.getElementById('ingredientInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      addIngredient();
      event.preventDefault();
    }
  });
  
  // Fetch recipes from Spoonacular API with instructions required and a higher number returned
  async function fetchRecipes() {
    const ingredients = Array.from(document.querySelectorAll('#ingredientList li'))
                            .map(li => li.textContent.trim())
                            .join(',');
    const apiKey = '05e656c53928421a8a760f7f38ac5db0'; // Replace with your API key if needed
    // Set number=100 and instructionsRequired=true to get recipes with instructions only.
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=100&instructionsRequired=true&apiKey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes', error);
    }
  }
  
  // Fetch full recipe details by ID
  async function fetchRecipeDetails(recipeId) {
    const apiKey = '05e656c53928421a8a760f7f38ac5db0';
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayRecipeDetails(data);
    } catch (error) {
      console.error('Error fetching recipe details', error);
    }
  }
  
  // Display recipe details in the modal
  function displayRecipeDetails(recipe) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 300px;"><br>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      <p><strong>Preparation time:</strong> ${recipe.preparationMinutes || 'N/A'} minutes</p>
      <p><strong>Cooking time:</strong> ${recipe.cookingMinutes || 'N/A'} minutes</p>
      <p><strong>Instructions:</strong> ${recipe.instructions || 'No specific instructions provided.'}</p>
      <button onclick="hideDetails()">Close</button>`;
    detailsDiv.style.display = 'block';
  }
  
  // Display recipes in the #results container (arranged in two columns via CSS Grid)
  function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    recipes.forEach(recipe => {
      const elem = document.createElement('div');
      elem.className = 'recipe-item';
      elem.innerHTML = `<strong>${recipe.title}</strong><br>
                        <img src="${recipe.image}" alt="${recipe.title}" style="width: 150px;"><br>
                        Used ingredients: ${recipe.usedIngredientCount}, Missing ingredients: ${recipe.missedIngredientCount}
                        <br><button onclick="fetchRecipeDetails(${recipe.id})">More Info</button>`;
      resultsDiv.appendChild(elem);
    });
  }
  
  // Hide the recipe details modal
  function hideDetails() {
    document.getElementById('details').style.display = 'none';
  }
  