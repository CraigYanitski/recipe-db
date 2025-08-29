async function sendEditPOST(recipe) {
    const url = `http://${window.location.host}/edit/${recipe}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipe)
        });
        if (!response.ok) {
            throw new Error("recipe edit failed");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

function setNotification(message, color) {
    sessionStorage.setItem("showNotification", "true");
    sessionStorage.setItem("notificationMessage", message);
    sessionStorage.setItem("notificationColor", color);
    window.location.replace("/");
}

document.addEventListener("DOMContentLoaded", function() {
    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const recipeID = new URL(window.location.href).pathname.split("/").filter(Boolean).pop();
        sendEditPOST(recipeID)
            .then(data => {
                setNotification(`Recipe ${recipeID} editted!`, "green");
                console.log(data);
            })
            .catch(error => {
                setNotification(`Failed to edit recipe...`, "red");
                console.error(error.message);
            });
    });
});

