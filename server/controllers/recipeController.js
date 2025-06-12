require("../models/database");
const category = require("../models/category");
const recipes = require("../models/recipe");

//------------HOMEPAGE--------
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await category.find({}).limit(limitNumber);
    const latest = await recipes.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await recipes.find({ category: "Thai" }).limit(limitNumber);
    const american = await recipes
      .find({ category: "American" })
      .limit(limitNumber);
    const chinese = await recipes
      .find({ category: "Chinese" })
      .limit(limitNumber);
    const mexican = await recipes
      .find({ category: "Mexican" })
      .limit(limitNumber);
    const indian = await recipes
      .find({ category: "Indian" })
      .limit(limitNumber);

    const food = { latest, thai, american, chinese, mexican, indian };

    res.render("index", { title: "Recipe Finder", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//------------CATEGORIES--------
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Recipe Finder - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesByID = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryByID = await recipes
      .find({ category: categoryId })
      .limit(limitNumber);
    const categoryData = await category.findOne({ name: categoryId });
    res.render("categories", {
      title: "Recipe Finder - Categories",
      categoryByID,
      categoryName: categoryData?.name || categoryId,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//------------ RECIPES --------
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await recipes.findById(recipeId);

    res.render("recipe", { title: "Recipe Finder", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//------------ EXPLORE LATEST --------
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 10;
    const recipe = await recipes.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Recipe Finder-Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//------------ RANDOM --------
exports.exploreRandom = async (req, res) => {
  try {
    let count = await recipes.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    const recipe = await recipes.findOne({}).skip(random).exec();
    res.render("explore-random", {
      title: "Recipe Finder-Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// ------------SEARCH-----------
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await recipes.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Recipe Finder - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//----------SUBMIT FORM--------------
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Recipe Finder - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new recipes({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();
    req.flash("infoSubmit", "Recipe published successfully.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};
