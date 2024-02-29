const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

//function that generates the next contactID in a series, starting at 1
const generateContactID = async (req, res, next) =>
{
    try 
    {
        //searching the existing contacts in the db for the highest ID
        const maxContact = await Contact.findOne().sort({ contactID: -1 });
        let nextContactID = 1;
        if (maxContact) 
        {
            nextContactID = maxContact.contactID + 1;
        }
        //declaring the request bodies contactID as equal to the next in the series
        req.body.contactID = nextContactID;
        next();
    }
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
}

//creates a contact and stores it in the database
router.post('/add', generateContactID, async (req, res) => 
{
    try 
    {
        //create the contact using the category retrieved from the middleware
        const contact = new Contact({
            ...req.body,
            categoryID: req.category.categoryID
        });
        await contact.save();
        res.status(201).json(contact);
    } 
    catch (err) //error handling
    {
        res.status(400).json({ message: err.message });
    }
});

//views all contacts in the database
router.get('/view/all', async (_, res) => 
{
    try
    {
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});

//view a contact via its contactID
router.get('/view/:contactID', getContact, async (req, res) => 
{
    try {
        const contact = await Contact.findById(req.params.contactID);
        if (!contact) 
        {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});

//updates a contact
router.patch('/update/:contactID', getContact, categoryExists, async (req, res) => 
{
    try
    {
        //checking that the categoryID in the exists in the categories
        const category = await Category.findOne({ categoryID: req.body.categoryID });
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found' });
        }
        if (req.body.fName != null) 
        {
            res.contact.fName = req.body.fName;
        }
        const updatedContact = await res.contact.save();
        res.json(updatedContact);
    }
    catch (err)
    {
      res.status(400).json({ message: err.message });
    }
});
//deletes a contact from the database
router.delete('/del/:contactID', getContact, async (_, res) => 
{
    try 
    {
        await res.contact.remove();
        res.json({ message: 'Contact deleted' });
    }
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
});

async function getContact(req, res, next) 
{
    let contact;
    try 
    {
        contact = await Contact.findById(req.params.id);
        if (contact == null) 
        {
            return res.status(404).json({ message: 'Contact not found' });
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ message: err.message });
    }
    res.contact = contact;
    next();
}

//function that checks to see if a categoryID actually exists
async function categoryExists(req, res, next) 
{
    const { categoryID } = req.body;
    try 
    {
        //checks if the category with the provided categoryID exists in the database
        const category = await Category.findOne({ categoryID });
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found.' });
        }
        req.category = category;
        next();
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
}

module.exports = router;