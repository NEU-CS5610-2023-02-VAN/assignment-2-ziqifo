import express from "express";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import morgan from "morgan";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// express init
const app = express();

// Serve static files from the client directory
app.use(express.static(path.resolve('..', 'client')));

// express configurations
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const prisma = new PrismaClient();

// Error handling
const handleError = (err, res) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

// API endpoints

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await prisma.recipe.findMany();
    res.status(200).json(allRecipes);
  } catch (err) {
    handleError(err, res);
  }
});

app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
    });
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: `Recipe with id ${id} not found` });
    }
  } catch (err) {
    handleError(err, res);
  }
});

app.post("/recipes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "title and content are required" });
  } else {
    try {
      const newRecipe = await prisma.recipe.create({
        data: {
          title,
          content,
        },
      });
      res.status(201).json(newRecipe);
    } catch (err) {
      handleError(err, res);
    }
  }
});

app.put("/recipes/:id", async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  if (!title || !content) {
    res.status(400).json({ error: "title and content are required" });
  } else {
    try {
      const updatedRecipe = await prisma.recipe.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          content,
        },
      });
      if (updatedRecipe) {
        res.status(200).json(updatedRecipe);
      } else {
        res.status(404).json({ error: `Recipe with id ${id} not found` });
      }
    } catch (err) {
      handleError(err, res);
    }
  }
});

app.delete("/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecipe = await prisma.recipe.delete({
      where: {
        id: parseInt(id),
      },
    });
    if (deletedRecipe) {
      res.status(200).json({ message: `Recipe with id ${id} has been deleted` });
    } else {
      res.status(404).json({ error: `Recipe with id ${id} not found` });
    }
  } catch (err) {
    handleError(err, res);
  }
});

// Starts HTTP Server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} 🎉 🚀`);
});