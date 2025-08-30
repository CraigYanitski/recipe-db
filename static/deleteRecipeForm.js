async function sendPOST(recipe) {
    const url = `http://${window.location.host}/delete/${recipe}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: recipe})
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
    sendPOST(recipeID)
        .then(data => {
            setNotification(`Recipe ${recipeID} deleted!`, "green", "/");
            console.log(data);
        })
        .catch(error => {
            setNotification(`Failed to delete recipe...`, "red", "/");
            console.error(error.message);
        });
}

function editRecipe() {
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", function() {
    const linkForm = document.getElementById("recipe-link-form");
    linkForm.addEventListener("delete", function(e) {
        e.preventDefault();
        alert("deleting recipe");
        const recipeID = new URL(window.location.href).pathname.split("/").filter(Boolean).pop();
        sendPOST(recipeID)
            .then(data => {
                setNotification(`Recipe ${recipeID} deleted!`, "green", "/");
                console.log(data);
            })
            .catch(error => {
                setNotification(`Failed to delete recipe...`, "red", "/");
                console.error(error.message);
            });
    });
    linkForm.addEventListener("edit", function(e) {
        e.preventDefault();
        alert("editing recipe");
        window.location.reload();
    });
});

