
const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id',  recipeController.exploreCategoriesByID);
router.get('/explore-latest',  recipeController.exploreLatest);
router.get('/explore-random',  recipeController.exploreRandom);
router.post('/categories/:id',  recipeController.searchRecipe);
router.get('/submit-recipe',  recipeController.submitRecipe);
router.post('/submit-recipe',  recipeController.submitRecipeOnPost);


module.exports = router;