window.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("showNotification") == "true") {
        const message = sessionStorage.getItem("notificationMessage");
        const color = sessionStorage.getItem("notificationColor");
        if (message != "") {
            showNotification(message, color);
        }
        sessionStorage.removeItem("showNotification");
        sessionStorage.removeItem("notificationMessage");
        sessionStorage.removeItem("notificationColor");
    }

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

    async function submitRecipe(recipe) {
        const url = `http://${window.location.host}/create`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recipe)
            });
            if (!response.ok) {
                throw new Error("recipe submission failed");
            }
            const result = await response.json();
            // console.log("recipe successfully created")
            return result;
        } catch (error) {
            // console.error("Error in recipe submission:", error);
            throw error;
        }
    }

    function setNotification(message, color) {
        sessionStorage.setItem("showNotification", "true");
        sessionStorage.setItem("notificationMessage", message);
        sessionStorage.setItem("notificationColor", color);
        window.location.reload();
    }

    function showNotification(message, color) {
        banner = document.getElementById("notification-banner");
        bannerMessage = document.getElementById("notification-message");
        banner.style.background = color;
        bannerMessage.textContent = message;
        banner.classList.add("show");
        setTimeout(() => {
            banner.classList.remove("show");
        }, 5000);
    }

    recipeForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const recipeName = document.getElementById("recipe-name");
        const recipeIngredients = document.querySelectorAll(".ingredient-input");
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

        const newRecipe = {
            "name": recipeName.value.trim(),
            "ingredients": ingredients,
            "instructions": instructions,
            "cook-time": parseInt(recipeCooktime.value)
        }

        submitRecipe(newRecipe)
            .then(data => {
                setNotification(`Recipe ${newRecipe.name} created!`, "#013221");
                console.log(data);
            })
            .catch(error => {
                setNotification(`Failed to create recipe...`, "#660001");
                console.error(error);
            });
    });
});

