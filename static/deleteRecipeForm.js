async function sendPOST(endpoint, recipe, data={}) {
    const url = `http://${window.location.host}/${endpoint}/${recipe}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("recipe deletion failed");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

function setNotification(message, color, href) {
    sessionStorage.setItem("showNotification", "true");
    sessionStorage.setItem("notificationMessage", message);
    sessionStorage.setItem("notificationColor", color);
    window.location.replace(href);
}

function deleteRecipe() {
    const recipeID = new URL(window.location.href).pathname.split("/").filter(Boolean).pop();
    sendPOST("delete", recipeID)
        .then(data => {
            setNotification(`Recipe ${recipeID} deleted!`, "#013221", "/");
            console.log(data);
        })
        .catch(error => {
            setNotification(`Failed to delete recipe...`, "#660001", "/");
            console.error(error.message);
        });
}

function createForm() {
}

function editRecipe(recipe) {
    const recipeID = new URL(window.location.href).pathname.split("/").filter(Boolean).pop();
    const url = `http://${window.location.host}`
    sendPOST("edit", recipeID, recipe)
        .then(data => {
            console.log(data);
            setNotification(`Recipe ${recipeID} edited!`, "#013221", url);
        })
        .catch(error => {
            console.error(error.message);
            setNotification(`Failed to edit recipe...`, "#660001", url);
        });
}

function toggleEditRecipe() {
    const recipe = document.getElementById("recipe-list");
    const editForm = document.getElementById("edit-recipe-form");
    if (recipe.style.display == "grid") {
        recipe.style.display = "none";
        editForm.style.display = "block";
    } else {
        recipe.style.display = "grid";
        editForm.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const recipeLinks = document.getElementById("recipe-link-form");


    recipeLinks.addEventListener("submit", toggleEditRecipe)

    const editForm = document.getElementById("edit-recipe");

    // recipe name group
    const recipeNameGroup = document.createElement("div");
    recipeNameGroup.className = "form-group";
    const recipeNameLabel = document.createElement("label");
    recipeNameLabel.innerHTML = "Recipe Name";
    recipeNameGroup.appendChild(recipeNameLabel)
    const recipeNameInput = document.createElement("input");
    recipeNameInput.type = "text";
    recipeNameInput.id = "recipe-name-input";
    recipeNameGroup.appendChild(recipeNameInput);
    editForm.appendChild(recipeNameGroup)
    // recipe ingredients group
    const ingredientGroup = document.createElement("div");
    ingredientGroup.className = "form-group";
    const ingredientLabel = document.createElement("label");
    ingredientLabel.innerHTML = "Ingredients";
    ingredientGroup.appendChild(ingredientLabel);
    const ingredientContainer = document.createElement("div");
    ingredientContainer.className = "ingredients-container";
    ingredientContainer.id = "all-ingredients";
    ingredientGroup.appendChild(ingredientContainer);
    var addIngredientButton = document.createElement("button");
    addIngredientButton.className = "add-button";
    addIngredientButton.id = "add-ingredient-button";
    addIngredientButton.type = "button";
    addIngredientButton.innerHTML = "Add Ingredient";
    ingredientGroup.appendChild(addIngredientButton);
    editForm.appendChild(ingredientGroup)
    // recipe instructions group
    const instructionGroup = document.createElement("div");
    instructionGroup.className = "form-group";
    const instructionLabel = document.createElement("label");
    instructionLabel.innerHTML = "Instructions";
    instructionGroup.appendChild(instructionLabel);
    const instructionContainer = document.createElement("div");
    instructionContainer.className = "instructions-container";
    instructionContainer.id = "all-instructions";
    instructionGroup.appendChild(instructionContainer);
    var addInstructionButton = document.createElement("button");
    addInstructionButton.className = "add-button";
    addInstructionButton.id = "add-instruction-button";
    addInstructionButton.type = "button";
    addInstructionButton.innerHTML = "Add Instruction";
    instructionGroup.appendChild(addInstructionButton);
    editForm.appendChild(instructionGroup)
    // recipe cook time group
    const cookTimeGroup = document.createElement("div");
    cookTimeGroup.className = "form-group";
    const cookTimeLabel = document.createElement("label");
    cookTimeLabel.innerHTML = "Creation Time";
    cookTimeGroup.appendChild(cookTimeLabel);
    const cookTimeInput = document.createElement("input");
    cookTimeInput.type = "number";
    cookTimeInput.placeholder = "Total creation time in minutes";
    cookTimeInput.id = "recipe-cook-time-input";
    cookTimeGroup.appendChild(cookTimeInput);
    editForm.appendChild(cookTimeGroup);
    // submit button
    const submitButton = document.createElement("button")
    submitButton.className = "submit-button";
    submitButton.type = "submit";
    submitButton.innerHTML = "Edit Recipe";
    editForm.appendChild(submitButton);

    const currentIngredients = document.getElementById("ingredient-list").children;
    const currentInstructions = document.getElementById("instruction-list").children;
    const currentCookTime = document.getElementById("cook-time-value").innerHTML;
    recipeNameInput.value = document.getElementById("recipe-name").innerHTML;
    cookTimeInput.value = currentCookTime
    var ingredients = [];
    var instructions = [];

    let ingredientCount = 0;
    let instructionCount = 0;
    
    function addIngredientInput(ingredient="") {
        ingredientCount++;
        const ingredientDiv = document.createElement("div");
        ingredientDiv.className = "ingredient";
        ingredientDiv.innerHTML = `
            <input type="text" id="ingredient-${ingredientCount}" placeholder="Ingredient ${ingredientCount}" value="${ingredient}" class="ingredient-input">
            <button type="button" class="remove-button">&times;</button>
        `;
        ingredientContainer.appendChild(ingredientDiv);

        const removeButton = ingredientDiv.querySelector(".remove-button");
        removeButton.addEventListener("click", function() {
            ingredientDiv.remove();
            ingredientCount--;
        });
    }
    for (var ingredient of currentIngredients) {
        ingredients.push(ingredient.innerHTML.trim());
        addIngredientInput(ingredient.innerHTML.trim());
    }
    addIngredientButton.addEventListener("click", () => {addIngredientInput("")})

    function addInstructionInput(instruction="") {
        instructionCount++;
        const instructionDiv = document.createElement("div");
        instructionDiv.className = "instruction";
        instructionDiv.innerHTML = `
            <input type="text" id="instruction-${instructionCount}" placeholder="Instruction ${instructionCount}" value="${instruction}" class="instruction-input">
            <button type="button" class="remove-button">&times;</button>
        `;
        instructionContainer.appendChild(instructionDiv);

        const removeButton = instructionDiv.querySelector(".remove-button");
        removeButton.addEventListener("click", function() {
            instructionDiv.remove();
            instructionCount--;
        });
    }
    for (var instruction of currentInstructions) {
        instructions.push(instruction.innerHTML.trim());
        addInstructionInput(instruction.innerHTML.trim());
    }
    addInstructionButton.addEventListener("click", () => {addInstructionInput("")})

    editForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const recipeName = document.getElementById("recipe-name-input");
        const recipeIngredients = document.querySelectorAll(".ingredient-input");
        const recipeInstructions = document.querySelectorAll(".instruction-input");
        const recipeCooktime = document.getElementById("recipe-cook-time-input");

        ingredients = [];
        recipeIngredients.forEach(input => {
            if (input.value.trim()) {
                ingredients.push(input.value.trim());
            }
        });

        instructions = [];
        recipeInstructions.forEach(input => {
            if (input.value.trim()) {
                instructions.push(input.value.trim());
            }
        });

        const newRecipe = {
            "name": recipeName.value.trim(),
            "ingredients": ingredients,
            "instructions": instructions,
            "cook-time": parseInt(recipeCooktime.value)
        };

        editRecipe(newRecipe);
    });
});

