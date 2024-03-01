const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

//function that gets a category via its id
async function getCategory(req, res, next) 
{
    let category;
    try
    {
        category = await Category.findById(req.params.id);
        if (category == null) //if there is no category that matches by id, returns a 404 error
        {
            return res.status(404).json({ message: 'Category not found' });
        }
    }  
    catch (err) 
    {
        console.error("Error handling request:", err);
        return res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
    res.category = category; //gets the response and sets it as equal to the category
    next();
}

//creates a category
router.post('/add', async (req, res) => 
{
    console.log("Route Handler: /add called");
    try 
    {
        const categories = req.body.map(category => 
            //makes a 2 letter uppercase categordyID based off the first two letters of
            //the contactName that's sent into the db.
        {
            const categoryID = category.categoryName.substring(0, 2).toUpperCase();
            return { categoryName: category.categoryName, categoryID: categoryID };
        });
        const createdCategories = await Category.insertMany(categories);
        res.status(201).json(createdCategories);
        console.log("Created succesfully")
    } 
    catch (err) 
    {
        console.error("Error handling request:", err);
        res.status(400).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//gets all categories
router.get('/view/all', async (_, res) => 
{
    console.log("Route Handler: /view/all called");
    try 
    {
        const categories = await Category.find();
        res.json(categories); //returns all of the categories in the db
    }
    catch (err)
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//getting a category via its categoryID
router.get('/view/:categoryID', async (req, res) => 
{
    console.log("Route Handler: /view/ called");
    try 
    {
        const category = await Category.findOne({ categoryID: req.params.categoryID.toUpperCase() });
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
            //if the can't find the category, returns this error
        }
        res.json(category); //returns the found category
    } 
    catch (err) 
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});
  
//deletes a category
router.delete('/del/:categoryID', getCategory, async (_, res) => 
{
    console.log("Route Handler: /del/ called");
    try 
    {
        await res.category.remove();
        res.json({ message: 'Category deleted' }); //removes the category
    }
    catch (err) 
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

module.exports = router;