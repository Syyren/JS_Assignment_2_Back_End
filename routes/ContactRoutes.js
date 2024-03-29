const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Category = require('../models/Category');

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
        console.error("Error handling request:", err);
        res.status(500).json({ message: error.message }); //error handling
    }
}

//function that checks to see if a categoryID actually exists
async function categoryExists(req, res, next) 
{
    const { categoryID } = req.body;
    try 
    {
        console.log("Request Body:", req.body); //logs the request body in the server terminal
        //checks if the category with the provided categoryID exists in the database
        const category = await Category.findOne({ categoryID });
        if (!category) 
        {
            return res.status(404).json({ message: 'Category not found.' }); //returns not found error
        }
        req.category = category;
        next();
    } 
    catch (err) 
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
}


//function that gets a contact by its ID
async function getContact(req, res, next) 
{
    console.log("getContact called");
    const contactID = req.params.contactID;
    console.log("ContactID from request:", contactID);
    let contact;
    try 
    {
        contact = await Contact.findOne({ contactID: req.params.contactID });
        console.log("Contact found:", contact);
        if (contact == null) 
        {
            return res.status(404).json({ message: 'Contact not found' }); //returns not found error
        }
    } 
    catch (err) 
    {
        console.error("Error handling request:", err);
        return res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
    res.contact = contact;
    next();
}

//creates a contact and stores it in the database
router.post('/add', generateContactID, categoryExists, async (req, res) => 
{
    console.log("Route Handler: /add called");
    try 
    {
        //create the contact using the category retrieved from the above functions
        const contact = new Contact({
            ...req.body,
            categoryID: req.category.categoryID
        });
        console.log("Creating contact:", contact);
        await contact.save();
        res.status(201).json(contact);
    } 
    catch (err)
    {
        console.error("Error handling request:", err);
        res.status(400).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//views all contacts in the database
router.get('/view/all', async (_, res) => 
{
    console.log("Route Handler: /view/all called");
    try
    {
        const contacts = await Contact.find();
        res.json(contacts); //returns all contacts in the db
    }
    catch (err)
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//view a contact via its contactID
router.get('/view/:contactID', getContact, async (_, res) => 
{
    console.log("Route Handler: /view/"+res.contact.contactID.toString()+" called");
    try 
    {
        const contact = res.contact;
        console.log("Contact sent in response body:", contact);
        res.json(contact); //returns the desired contact
    } 
    catch (err) 
    {
        console.error("Error handling request:", err);
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//updates a contact via their contactID
router.patch('/update/:contactID', getContact, categoryExists, async (req, res) => 
{
    console.log("Route Handler: /update/"+res.contact.contactID.toString()+" called");
    try
    {
        const updatedFields = req.body;
        console.log("Updated fields:", updatedFields)
        //updates all fields sent in the request body
        for (const key in updatedFields) //logs each key being sent in the request body and updates a given field
        {
            if (updatedFields.hasOwnProperty(key))
            {
                res.contact[key] = updatedFields[key];
            }
        }
        const updatedContact = await res.contact.save();
        res.json(updatedContact); //updating the contact
        console.log("Updated successfully")
    }
    catch (err)
    {
      res.status(400).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

//deletes a contact from the database
router.delete('/del/:contactID', getContact, async (req, res) => 
{
    console.log("Route Handler: /del/"+res.contact.contactID.toString()+" called");
    try 
    {
        await Contact.deleteOne({ contactID: req.params.contactID });
        res.json({ message: 'Contact deleted' });
    }
    catch (err) 
    {
        res.status(500).json({ message: err.message }); //if the handler encounters an error, returns it here
    }
});

module.exports = router;