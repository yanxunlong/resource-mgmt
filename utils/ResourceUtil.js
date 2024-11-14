const { Resource } = require('../models/Resource');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addResource(req, res) {
    try {
        const name = req.body.name;
        const location = req.body.location;
        const description = req.body.description;
        const owner = req.body.owner;

        if (!owner.includes('@') || !owner.includes('.') || description.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newResource = new Resource(name, location, description, owner);
            const updatedResources = await writeJSON(newResource,
                'utils/resources.json');
            return res.status(201).json(updatedResources);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewResources(req, res) {
    try {
        const allResources = await readJSON('utils/resources.json');
        return res.status(201).json(allResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editResource(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const location = req.body.location;
        const description = req.body.description;
        const allResources = await readJSON('utils/resources.json');
        var modified = false;
        for (var i = 0; i < allResources.length; i++) {
            var curcurrResource = allResources[i];
            if (curcurrResource.id == id) {
                allResources[i].name = name;
                allResources[i].location = location;
                allResources[i].description = description;
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile('utils/resources.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteResource(req, res) {
    try {
        const id = req.params.id;
        const allResources = await readJSON('utils/resources.json');
        var index = -1;
        for (var i = 0; i < allResources.length; i++) {
            var curcurrResource = allResources[i];
            if (curcurrResource.id == id)
                index = i;
        }
        if (index != -1) {
            allResources.splice(index, 1);
            await fs.writeFile('utils/resources.json', JSON.stringify(allResources), 'utf8');
            return res.status(201).json({ message: 'Resource deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addResource, viewResources, editResource, deleteResource
};