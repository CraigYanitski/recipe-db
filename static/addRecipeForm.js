document.addEventListener("DOMContentLoaded", function() {
    const ingredientContainer = document.getElementById("all-ingredients");
    const addIngredientButton = document.getElementById("add-ingredient-button");
    const instructionContainer = document.getElementById("all-instructions");
    const addInstructionButton = document.getElementById("add-instruction-button");
    const recipeForm = document.getElementById("new-recipe");

    let ingredientCount = 0;
    let instructionCount = 0;

    addIngredientInput();
    addInstructionInput();

    function addIngredientInput() {
        ingredientCount++;
        const ingredientDiv = document.createElement("div");
        ingredientDiv.className = "ingredient";
        ingredientDiv.innerHTML = `
            <input type="text" id="ingredient-${ingredientCount}" placeholder="Ingredient ${ingredientCount}" class="ingredient-input">
            <button type="button" class="remove-button">&times;</button>
        `;
        ingredientContainer.appendChild(ingredientDiv);

        const removeButton = ingredientDiv.querySelector(".remove-button");
        removeButton.addEventListener("click", function() {
            ingredientDiv.remove();
            ingredientCount--;
        });
    }

    addIngredientButton.addEventListener("click", addIngredientInput);

    function addInstructionInput() {
        instructionCount++;
        const instructionDiv = document.createElement("div");
        instructionDiv.className = "instruction";
        instructionDiv.innerHTML = `
            <input type="text" id="instruction-${instructionCount}" placeholder="Step ${instructionCount}" class="instruction-input">
            <button type="button" class="remove-button">&times;</button>
        `;
        instructionContainer.appendChild(instructionDiv);

        const removeButton = instructionDiv.querySelector(".remove-button");
        removeButton.addEventListener("click", function() {
            instructionDiv.remove();
            instructionCount--;
        });
    }

    addInstructionButton.addEventListener("click", addInstructionInput);

    recipeForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const recipeName = document.getElementById("recipe-name");
        const recipeIngredients = document.querySelectorAll(".ingredint-input");
        const recipeInstructions = document.querySelectorAll(".instruction-input");
        const recipeCooktime = document.getElementById("recipe-cooktime");

        const ingredients = [];
        recipeIngredients.forEach(input => {
            if (input.value.trim()) {
                ingredients.push(input.value.trim());
            }
        });

        const instructions = [];
        recipeInstructions.forEach(input => {
            if (input.value.trim()) {
                instructions.push(input.value.trim());
            }
        });

        alert(`Recipe ${recipeName.value.trim()} created!`);
    });
});

