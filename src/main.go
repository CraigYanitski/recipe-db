package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Recipe struct {
    Name          string    `json:"name"`
    Ingredients   []string  `json:"ingredients"`
    Instructions  []string  `json:"instructions"`
    CookTime      int       `json:"cook time"`
}

type Recipes struct {
    Recipes  []Recipe  `json:"recipes"`
}

func replace(input, old, new string) string {
    return strings.ReplaceAll(input, old, new)
}

type apiConfig struct {
    recipes  Recipes
}

func main() {
    // open and unmarshal recipe json
    recipeDataBytes, err := os.ReadFile("./content/recipes.json")
    if err != nil {
        panic(err)
    }
    var recipes Recipes
    if err = json.Unmarshal(recipeDataBytes, &recipes); err != nil {
        panic(err)
    }

    apiCfg := apiConfig{
        recipes: recipes,
    }

    err = clearDir("./public")
    if err != nil {
        panic(err)
    }

    err = apiCfg.writeHTML()
    if err != nil {
        panic(err)
    }

    mux := http.NewServeMux()

    fs := http.FileServer(http.Dir("./public"))
    mux.Handle("GET /", fs)
    mux.HandleFunc("POST /", apiCfg.createRecipeHandler)
    mux.HandleFunc("POST /{recipe}", apiCfg.editRecipeHandler)

    port := "8080"
    server := http.Server{
        Addr: ":"+port,
        Handler: mux,
    }

    fmt.Printf("Serving recipes on port %s\n", port)
    log.Fatal(server.ListenAndServe())
}

func clearDir(dir string) error {
    contents, err := os.ReadDir(dir)
    if err != nil {
        return err
    }

    for _, item := range contents {
        err = os.RemoveAll(filepath.Join(dir, item.Name()))
        if err != nil {
            return err
        }
    }
    return nil
}

func copyFile(src, dst string) error {
    srcFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer srcFile.Close()
    dstFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer dstFile.Close()
    if _, err = io.Copy(dstFile, srcFile); err != nil {
        return err
    }
    return nil
}

func (cfg apiConfig) writeHTML() error {
    // copy static files
    err := copyFile("./static/addRecipeForm.js", "./public/addRecipeForm.js")
    if err != nil {
        panic(err)
    }

    err = copyFile("./static/index.css", "./public/index.css")
    if err != nil {
        panic(err)
    }

    // read in html templates
    // index
    indexBytes, err := os.ReadFile("./static/index.html")
    if err != nil {
        return err
    }
    indexTemplate := string(indexBytes)
    // recipe
    recipeBytes, err := os.ReadFile("./static/recipe.html")
    if err != nil {
        return err
    }
    recipeTemplate := string(recipeBytes)

    // write html files
    funcMap := template.FuncMap{
        "lower": strings.ToLower,
        "replace": replace,
    }
    // index
    file, err := os.Create("./public/index.html")
    if err != nil {
        return err
    }
    defer file.Close()

    temp := template.Must(template.New("").Funcs(funcMap).Parse(indexTemplate))
    if err = temp.Execute(file, cfg.recipes); err != nil {
        return err
    }
    // recipe
    for _, recipe := range cfg.recipes.Recipes {
        dirname := strings.ToLower(strings.ReplaceAll(recipe.Name, " ", "-"))
        if err = os.Mkdir("./public/"+dirname, 0700); err != nil {
            return err
        }
        recipeFile, err := os.Create("./public/"+dirname+"/index.html")
        if err != nil {
            return err
        }

        temp := template.Must(template.New("").Funcs(funcMap).Parse(recipeTemplate))
        if err = temp.Execute(recipeFile, recipe); err != nil {
            return err
        }

        recipeFile.Close()
    }

    return nil
}

func (cfg *apiConfig) createRecipeHandler(w http.ResponseWriter, r *http.Request) {
    decoder := json.NewDecoder(r.Body)
    newRecipe := &Recipe{}
    err := decoder.Decode(newRecipe)
    if err != nil {
        respondWithError(
            w,
            http.StatusInternalServerError,
            "error decoding JSON of new recipe.",
            err,
        )
    }

    cfg.recipes.Recipes = append(cfg.recipes.Recipes, *newRecipe)
    err = cfg.writeRecipes()
    if err != nil {
        respondWithError(
            w,
            http.StatusInternalServerError,
            "unable to save new recipe",
            err,
        )
    }

    respondWithJSON(w, http.StatusOK, nil)
}

func (cfg apiConfig) writeRecipes() error {
    recipeBytes, err := json.Marshal(cfg.recipes)
    if err != nil {
        return err
    }
    err = os.WriteFile("./content/recipes.json", recipeBytes, 0644)
    if err != nil {
        return err
    }
    return nil
}

func (cfg *apiConfig) editRecipeHandler(w http.ResponseWriter, r *http.Request) {
    oldRecipeName, err := r.PathValue("recipe")
    if err != nil {
        respondWithError(w, http.StatusBadRequest, "unable to parse recipe name", err)
    }
}

