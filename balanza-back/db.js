import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'recipes.db'));

// Initialize database with tables
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipe_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    ingredient TEXT NOT NULL,
    target_weight REAL NOT NULL,
    step_order INTEGER NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
  );
`);

// Prepare statements for better performance
const stmts = {
  getAllRecipes: db.prepare(`
    SELECT r.*, json_group_array(
      json_object(
        'id', s.id,
        'ingredient', s.ingredient,
        'targetWeight', s.target_weight,
        'order', s.step_order
      )
    ) as steps
    FROM recipes r
    LEFT JOIN recipe_steps s ON r.id = s.recipe_id
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `),
  
  getRecipeById: db.prepare(`
    SELECT r.*, json_group_array(
      json_object(
        'id', s.id,
        'ingredient', s.ingredient,
        'targetWeight', s.target_weight,
        'order', s.step_order
      )
    ) as steps
    FROM recipes r
    LEFT JOIN recipe_steps s ON r.id = s.recipe_id
    WHERE r.id = ?
    GROUP BY r.id
  `),
  
  insertRecipe: db.prepare(`
    INSERT INTO recipes (name) VALUES (?)
  `),
  
  insertStep: db.prepare(`
    INSERT INTO recipe_steps (recipe_id, ingredient, target_weight, step_order)
    VALUES (?, ?, ?, ?)
  `),
  
  updateRecipe: db.prepare(`
    UPDATE recipes SET name = ? WHERE id = ?
  `),
  
  deleteRecipe: db.prepare(`
    DELETE FROM recipes WHERE id = ?
  `),
  
  deleteSteps: db.prepare(`
    DELETE FROM recipe_steps WHERE recipe_id = ?
  `)
};

// Transaction for saving a complete recipe with steps
const saveRecipe = db.transaction((recipe) => {
  let recipeId = recipe.id;
  
  if (!recipeId) {
    const result = stmts.insertRecipe.run(recipe.name);
    recipeId = result.lastInsertRowid;
  } else {
    stmts.updateRecipe.run(recipe.name, recipeId);
    stmts.deleteSteps.run(recipeId);
  }
  
  recipe.steps.forEach((step, index) => {
    stmts.insertStep.run(recipeId, step.ingredient, step.targetWeight, index);
  });
  
  return recipeId;
});

export { db, stmts, saveRecipe };