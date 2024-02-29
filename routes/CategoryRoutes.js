const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

//creates a category
router.post('/add', async (req, res) => {
    try 
    {
        const categories = req.body.map(category => {
            const categoryID = category.categoryName.substring(0, 2).toUpperCase();
            return { categoryName: category.categoryName, categoryID: categoryID };
        });
        const createdCategories = await Category.insertMany(categories);
        res.status(201).json(createdCategories);
    } 

    catch (err) 
    {
        res.status(400).json({ message: err.message });
    }
});

//get all categories
router.get('/view/all', async (_, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    }

    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});

//getting a category via its categoryID
router.get('/view/:categoryID', async (req, res) => {
    try 
    {
        const category = await Category.findOne({ categoryID: req.params.categoryID.toUpperCase() });
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});

//updates a category
router.patch('/update/:categoryID', getCategory, async (req, res) => {
    if (req.body.categoryName != null) 
    {
        res.category.categoryName = req.body.categoryName;
    }
    //updating other fields similarly
    try 
    {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    }

    catch (err) 
    {
        res.status(400).json({ message: err.message });
    }
});
  
  //deletes a category
  router.delete('/del/:categoryID', getCategory, async (_, res) => {
    try 
    {
        await res.category.remove();
        res.json({ message: 'Category deleted' });
    }
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});
  

async function getCategory(req, res, next) {
    let category;
    try
    {
        category = await Category.findById(req.params.id);
        if (category == null) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }
    } 
    
    catch (err) 
    {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}

module.exports = router;