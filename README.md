Recipe DB
===

This is just a minimal server I have developed for my local network to save the recipes of 
written on increasingly decaying index cars, slips of paper, or even sections of cardboard 
accumulated over the years.
While the data remains private, I am making the code public.

Motivation
---

While this started out as a simple file server, user demand forced me to develop this into a full-stack project.
Despite the name, I am not getting into any database management here.
This project relies on recipe data stored in a single JSON.
No encryption, no SQL shenanigans, just simple text file management.

Recipe data
---

This code relies on a JSON file with the format,

```json
{
    "recipes": [
        {
            "name": "STRING",
            "ingredients": ["[]STRING..."],
            "instructions": ["[]STRING..."],
            "cook time": "NUMBER"
        }
    ]
}
```

Development
---

Feel free to use the code as you wish, but this is really a personal project and you can probably come up with 
better implementations of it starting from scratch.

The state of this project at the moment is rather RESTful, since you are able to create, edit, and delete 
recipes from the frontend.
However there is some formatting I want to fix in how the recipes are displayed, specifically allowing 
sections and notes in the recipe instructions.
I intend to keep all instructions in a <ul/> block for simplicity, but just format the <li/> 
when I want a section/note.
This should be finished in a week.

