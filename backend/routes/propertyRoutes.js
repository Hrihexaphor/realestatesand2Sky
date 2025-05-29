import express from 'express';
import NodeCache from 'node-cache';
import upload from '../middleware/upload.js';
import { insertProperty, insertPropertyDetails, insertImages, insertLocation, insertNearestTo, insertAmenities,insertPropertyDocuments,insertPropertyConfigurations,insertKeyfeature } from '../services/propertyService.js';
import { searchProperty,getpropertyById,updatePropertyById,getAllProperties,deletePropertyById,getReadyToMoveProperties,sendNewPropertyEmails } from '../services/propertyService.js';
import {getSubcategoriesByCategoryId} from '../services/propertySubcategory.js'
import { isAuthenticated } from '../middleware/auth.js';
const router = express.Router();
const propertyCache = new NodeCache({ stdTTL: 300 });

router.post('/property', upload.fields([
  { name: 'images', maxCount: 8 },
  { name: 'documents', maxCount: 10 },
  { name: 'configFiles', maxCount: 10 }  // Add this line
]), async (req, res) => {
  try { 
    if (!req.body.data) {
      return res.status(400).json({ error: 'Missing property data' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(req.body.data);
    } catch (err) {
      console.error('JSON parsing error:', err);
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    let { basic, details, location, nearest_to, amenities, configurations, keyfeature } = parsedData;
    
    // Validate required fields
    if (!basic || !basic.title) {
      return res.status(400).json({ error: 'Missing required property title' });
    }

    // Validate category_id and property_type
    if (!basic.category_id) {
      return res.status(400).json({ error: 'Missing required property category' });
    }

    if (!basic.property_type) {
      return res.status(400).json({ error: 'Missing required property type (subcategory)' });
    }

    // Validate that property_type is a valid subcategory for the given category_id
    try {
      const validSubcategories = await getSubcategoriesByCategoryId(basic.category_id);
      const isValidSubcategory = validSubcategories.some(subcategory => 
        subcategory.id === parseInt(basic.property_type)
      );
      
      if (!isValidSubcategory) {
        return res.status(400).json({ 
          error: 'Invalid property type. The selected property type does not belong to the selected category.' 
        });
      }
    } catch (err) {
      console.error('Error validating subcategory:', err);
      // Continue with the process even if validation fails
    }

    // Begin creation flow
    const property = await insertProperty(basic);

    if (details && Object.keys(details).length > 0) {
      await insertPropertyDetails(property.id, details);
    }

    if (location && (location.latitude || location.longitude)) {
      await insertLocation(property.id, location);
    }

    if (nearest_to && nearest_to.length > 0) {
      await insertNearestTo(property.id, nearest_to);
    }

    if (amenities && amenities.length > 0) {
      await insertAmenities(property.id, amenities);
    }
    
    if (keyfeature && keyfeature.length > 0) {
      await insertKeyfeature(property.id, keyfeature);
    }
    
    // Handle configuration files
    if (configurations && configurations.length > 0) {
      // Parse configuration file metadata if available
      let configFileMeta;
      try {
        configFileMeta = req.body.configFileMeta ? JSON.parse(req.body.configFileMeta) : [];
      } catch (err) {
        console.warn('Invalid configFileMeta format, treating as empty array:', err);
        configFileMeta = [];
      }

      // Process uploaded configuration files
      const configFiles = req.files?.configFiles || [];
      
      // Map each configuration with its corresponding file (if any)
      const processedConfigurations = configurations.map(config => {
        // Find metadata for this configuration by bhk_type
        const meta = configFileMeta.find(m => m.bhk_type === config.bhk_type);
        
        if (meta && meta.file_name) {
          // Find the uploaded file matching this metadata
          const uploadedFile = configFiles.find(f => f.originalname === meta.file_name);
          
          if (uploadedFile) {
            // Add the file URL to the configuration
            return { 
              ...config, 
              file_url: uploadedFile.path // This should be the Cloudinary URL
            };
          }
        }
        return config;
      });

      // Save configurations to database
      await insertPropertyConfigurations(property.id, processedConfigurations);
    }
    
    // Process images
    if (req.files?.images?.length > 0) {
      const imageLinks = req.files.images.map((file, index) => ({
        image_url: file.path, // Cloudinary URL
        is_primary: index === 0
      }));
      await insertImages(property.id, imageLinks);
    }
    // process document
    if (req.files?.documents?.length > 0) {
      let documents_metadata = [];
    
      try {
        documents_metadata = Array.isArray(req.body.documentMeta)
          ? req.body.documentMeta
          : JSON.parse(req.body.documentMeta || '[]');
      } catch (err) {
        console.warn('Invalid documentMeta:', err);
        documents_metadata = [];
      }
    
      const documents = req.files.documents.map(file => {
        const meta = documents_metadata.find(m => m.filename === file.originalname);
        return {
          file_url: file.path, // Cloudinary URL
          type: meta?.type || null
        };
      });
    
      await insertPropertyDocuments(property.id, documents);
    }
    await sendNewPropertyEmails(property.id);
    res.status(201).json({ success: true, property_id: property.id });
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).json({ error: 'Failed to add property', details: err.message });
  }
});
// Get all properties
router.get('/property', async (req, res) => {
  try {
    // Check if we have cached data
    const cachedProperties = propertyCache.get('allProperties');
    if (cachedProperties) {
      return res.status(200).json(cachedProperties);
    }

    // If no cache, get from database
    const properties = await getAllProperties();
    
    // Store in cache for future requests
    propertyCache.set('allProperties', properties);
    
    // Send response
    res.status(200).json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties', details: err.message });
  }
});

// Update property by ID
router.put('/property/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }
    
    const updatedData = req.body;
    console.log('Incoming update request for property ID:', propertyId);
    console.log('Updated data:', updatedData);
    
    await updatePropertyById(propertyId, updatedData);
    res.json({ success: true, message: 'Property updated successfully' });
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ success: false, message: 'Failed to update property', details: err.message });
  }
});

// Delete property by ID
router.delete('/property/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id, 10); // parse it safely

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid Property ID' });
    }

    const success = await deletePropertyById(propertyId);

    if (success) {
      res.status(200).json({ message: 'Property deleted successfully' });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Failed to delete property', details: err.message });
  }
});

//   get property by search filter

router.get('/property/search', async (req, res) => {
  try {
    const filters = {
      // Main filters
      property_type: req.query.property_type,
      bhk: req.query.bhk ? parseInt(req.query.bhk) : null,
      min_price: req.query.min_price ? parseInt(req.query.min_price) : null,
      max_price: req.query.max_price ? parseInt(req.query.max_price) : null,
      city: req.query.city,
      locality: req.query.locality,
      
      // Additional filters
      furnished_status: req.query.furnished_status,
      possession_status: req.query.possession_status,
      
      // Sorting and pagination
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order,
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 10
    };

    const results = await searchProperty(filters);

    res.status(200).json({
      success: true,
      count: results.pagination.total,
      data: results.properties,
      pagination: results.pagination
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: err.message
    });
  }
});
 
//get ready to move proerty routes

router.get('/properties/ready-to-move', async (req,res)=>{
  try{
      const properties = await getReadyToMoveProperties();
      res.status(200).json(properties)
  }catch(err){
    console.error('Error fetching ready to move properties:', err);
    res.status(500).json({error:'Failed to fetch ready to move properties'});
  }
})
// get all the new property from the table
// router.get('/properties/new', async (req, res) => {
//   try {
//     const properties = await getNewProperties();
//     res.status(200).json(properties);
//   } catch (err) {
//     console.error('Error fetching new properties:', err);
//     res.status(500).json({ error: 'Failed to fetch new properties' });
//   }
// });

// get property by id routes

router.get('/property/:id',async (req,res)=>{
  try{
    const propertyId = req.params.id;
    const propertyDetails = await getpropertyById(propertyId);
    if(!propertyDetails){
      return res.status(404).json({error:'property not found'})
    }
    res.json(propertyDetails)
  }catch(error){
    console.error('Error fetching property by id:', error);
    res.status(500).json({error:`failed to fetch property details by id`})
  }
})
export default router;

