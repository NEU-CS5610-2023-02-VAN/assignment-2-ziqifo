document.addEventListener('DOMContentLoaded', () => {
  const addNameInput = document.getElementById('addName');
  const addDetailInput = document.getElementById('addDetail');
  const addRecipeBtn = document.getElementById('addRecipeBtn');
  const updateNameInput = document.getElementById('updateName');
  const updateDetailInput = document.getElementById('updateDetail');
  const updateRecipeBtn = document.getElementById('updateRecipeBtn');
  const recipeList = document.getElementById('recipe-list');

  const addRecipe = async () => {
    const name = addNameInput.value;
    const detail = addDetailInput.value;

    if (name.trim() === '' || detail.trim() === '') {
      alert('Please enter a name and detail for the recipe.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: name, content: detail })
      });

      if (response.ok) {
        const newRecipe = await response.json();
        displayRecipe(newRecipe);
        addNameInput.value = '';
        addDetailInput.value = '';
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateRecipe = async () => {
    const name = updateNameInput.value;
    const detail = updateDetailInput.value;

    if (name.trim() === '' || detail.trim() === '') {
      alert('Please enter a name and detail for the recipe.');
      return;
    }

    try {
      const recipeToUpdate = document.querySelector(`li[data-name="${name}"]`);
      if (recipeToUpdate) {
        const id = recipeToUpdate.dataset.id;
        const response = await fetch(`http://localhost:8000/recipes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: name, content: detail })
        });

        if (response.ok) {
          const updatedRecipe = await response.json();
          recipeToUpdate.textContent = `${updatedRecipe.title}: ${updatedRecipe.content}`;
          updateNameInput.value = '';
          updateDetailInput.value = '';
        } else {
          console.error('Error:', response.statusText);
        }
      } else {
        alert('The recipe does not exist.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteRecipe = async (id, listItem) => {
    try {
      const response = await fetch(`http://localhost:8000/recipes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        recipeList.removeChild(listItem);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayRecipe = (recipe) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${recipe.title}: ${recipe.content}`;
    listItem.dataset.id = recipe.id;
    listItem.dataset.name = recipe.title;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteRecipe(recipe.id, listItem));
    listItem.appendChild(deleteBtn);
    recipeList.appendChild(listItem);
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:8000/recipes');
      const recipes = await response.json();
      recipeList.innerHTML = '';
      recipes.forEach((recipe) => {
        displayRecipe(recipe);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  addRecipeBtn.addEventListener('click', addRecipe);
  updateRecipeBtn.addEventListener('click', updateRecipe);

  fetchRecipes();
});
