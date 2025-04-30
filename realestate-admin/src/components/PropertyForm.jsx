import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Map, Building, Home, MapPin } from 'lucide-react';
import './propertyForm.css';

const PropertyForm = ({editData,onClose}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [basic, setBasic] = useState({
    property_category: '',
    property_type: '',
    transaction_type: 'Sale',
    title: '',
    possession_status: '',
    expected_price: '',
    price_per_sqft: '',
    developer_id: ''
  });
  const [details, setDetails] = useState({});
  const [location, setLocation] = useState({ latitude: '', longitude: '', address: '' });
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [nearestOptions, setNearestOptions] = useState([]);
  const [nearestTo, setNearestTo] = useState([]);
  const [images, setImages] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const overlookingOptions = [
    'Pool', 'Park', 'Road', 'Garden', 'Sea', 'River', 'Club', 'Temple'
  ];
  const [overlooking, setOverlooking] = useState([]);
  // edit property 
    useEffect(() => {
      if (editData) {
        // Populate basic information
        setBasic({
          property_category: editData.category_id || '',
          property_type: editData.property_type || '',
          transaction_type: editData.transaction_type || 'Sale',
          title: editData.title || '',
          possession_status: editData.possession_status || '',
          expected_price: editData.expected_price || '',
          price_per_sqft: editData.price_per_sqft || '',
          developer_id: editData.developer_id || ''
        });
        if (editData.category_id) {
          fetchSubcategories(editData.category_id);
        }
        // Populate property details - handle both possible data structures
        if (editData.details) {
          // If details are in a nested property
          setDetails(editData.details);
        } else {
          // If details are flat in the editData object, extract relevant fields
          // based on property type
          const detailsFields = {};
          
          // Common fields that might be present in any property type
          ['city', 'locality', 'description'].forEach(field => {
            if (editData[field]) detailsFields[field] = editData[field];
          });
          const categoryName = editData.property_category_name;
          // Specific fields based on property type
          if (categoryName === 'Apartment' || categoryName === 'Flat') {
            ['bedrooms', 'bathrooms', 'floor', 'total_floors', 'built_up_area', 
     'locality', 'bedrooms', 'balconies', 'bathrooms','project_area','no_of_flat','overlooking',
     'booking_amount','maintenance_charge','transaction_types','available_from', 
            'carpet_area', 'furnished_status', 'covered_parking',].forEach(field => {
              if (editData[field] !== undefined) detailsFields[field] = editData[field];
            });
          } else if (categoryName === 'Villa' || categoryName === 'House') {
            ['bedrooms', 'bathrooms', 'built_up_area', 'plot_area', 'total_floors',
            'furnished_status', 'covered_parking'].forEach(field => {
              if (editData[field] !== undefined) detailsFields[field] = editData[field];
            });
          } else if (categoryName === 'Plot' || categoryName === 'Land') {
            ['plot_area', 'plot_length', 'plot_breadth', 'plot_type', 'facing', 
            'project_rera_id'].forEach(field => {
              if (editData[field] !== undefined) detailsFields[field] = editData[field];
            });
          } else if (categoryName === 'Hostel') {
            ['total_rooms', 'room_sharing', 'furnished_status'].forEach(field => {
              if (editData[field] !== undefined) detailsFields[field] = editData[field];
            });
          }
          
          setDetails(detailsFields);
        }
      // edit images
      if (editData && editData.images && Array.isArray(editData.images)) {
        // Convert image URLs to a format your component can display
        const existingImages = editData.images.map(img => ({
          url: img.image_url,
          id: img.id,
          is_primary: img.is_primary
        }));
        setImages(existingImages);
      }
      // edit document
      if (editData && editData.documents && Array.isArray(editData.documents)) {
        // Convert document data to the format expected by your component
        const existingDocs = editData.documents.map(doc => ({
          file: { name: doc.type.replace(/_/g, ' ') + ' file' }, // Get filename from URL or use type as name
          type: doc.type,
          url: doc.file_url,
          id: doc.id
        }));
        setDocuments(existingDocs);
      }
      // Rest of the existing useEffect code...
      setLocation({
        latitude: editData.latitude || '',
        longitude: editData.longitude || '',
        address: editData.address || ''
      });
      
      if (map && marker && editData.latitude && editData.longitude) {
        const position = { lat: parseFloat(editData.latitude), lng: parseFloat(editData.longitude) };
        map.setCenter(position);
        marker.setPosition(position);
      }
      
      if (editData.amenities && Array.isArray(editData.amenities)) {
        setSelectedAmenities(editData.amenities.map(a => typeof a === 'object' ? a.id : a));
      }
      
      if (editData.nearest_to && Array.isArray(editData.nearest_to)) {
        setNearestTo(
          editData.nearest_to.map(n => ({
            nearest_to_id: n.id,
            distance_km: n.distance_km
          }))
        );
      }
    }
  }, [editData, map, marker]);
  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [amenityRes, developerRes, nearestRes, categoryRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/amenities`),
          axios.get(`${BASE_URL}/api/developer`),
          axios.get(`${BASE_URL}/api/nearest`),
          axios.get(`${BASE_URL}/api/category`)
        ]);
        
        setAmenities(amenityRes.data);
        setDevelopers(developerRes.data);
        setNearestOptions(nearestRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
    initMap();
  }, []);

    // Function to fetch subcategories based on selected category
    const fetchSubcategories = async (categoryId) => {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }
      
      try {
        const response = await axios.get(`${BASE_URL}/api/subcategory/${categoryId}`);
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    };
  // Initialize Google Maps
  const initMap = () => {
    if (!window.google) {
      // Google Maps script isn't loaded yet
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD5wm8v-1UOn3-5Dtwr2tKyTwGpUTHaEeU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initMap(); // Retry after script loads
      };
      document.head.appendChild(script);
      return;
    }
  
    if (mapLoaded) return; // Prevent reinitialization
  
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi, India
  
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
    });
  
    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
    });
  
    setLocation({
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lng,
      address: '',
    });
  
    // Map click to update marker and reverse geocode
    mapInstance.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
  
      markerInstance.setPosition({ lat, lng });
      setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setLocation((prev) => ({
            ...prev,
            address: results[0].formatted_address,
          }));
        }
      });
    });
  
    // Marker drag to update location
    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      const lat = position.lat();
      const lng = position.lng();
  
      setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setLocation((prev) => ({
            ...prev,
            address: results[0].formatted_address,
          }));
        }
      });
    });
  
    // Setup autocomplete on address input
    if (addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
      });
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
  
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
  
        mapInstance.setCenter({ lat, lng });
        markerInstance.setPosition({ lat, lng });
  
        setLocation({
          address: place.formatted_address,
          latitude: lat,
          longitude: lng,
        });
      });
    }
  
    // Save map and marker instances
    setMap(mapInstance);
    setMarker(markerInstance);
    setMapLoaded(true);
  };

  // Use browser's geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map && marker) {
            map.setCenter({ lat, lng });
            marker.setPosition({ lat, lng });
            setLocation({ ...location, latitude: lat, longitude: lng });
            
            // Get address from coordinates
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setLocation(prev => ({ ...prev, address: results[0].formatted_address }));
              }
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Error getting your location. Please select manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasic(prev => ({ ...prev, [name]: value }));
    
    // When category changes, fetch subcategories and reset property_type
    if (name === 'property_category') {
      fetchSubcategories(value);
      setBasic(prev => ({ ...prev, property_type: '' }));
      setDetails({});
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = () => {
    if (!window.google || !map) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location.address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        
        map.setCenter({ lat, lng });
        marker.setPosition({ lat, lng });
        setLocation({ latitude: lat, longitude: lng, address: location.address });
      } else {
        alert("Address not found. Please try again.");
      }
    });
  };

  const handleAmenityToggle = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNearestAdd = () => {
    setNearestTo([...nearestTo, { nearest_to_id: '', distance_km: '' }]);
  };

  const handleNearestRemove = (index) => {
    const updated = [...nearestTo];
    updated.splice(index, 1);
    setNearestTo(updated);
  };

  const handleNearestChange = (index, field, value) => {
    const updated = [...nearestTo];
    updated[index][field] = value;
    setNearestTo(updated);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    // Optional: Filter duplicates
    const filtered = selectedFiles.filter(
      newFile => !images.some(existing => existing.name === newFile.name && existing.size === newFile.size)
    );
  
    setImages(prev => [...prev, ...filtered]);
  }
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDocumentChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newDocs = selectedFiles.map(file => ({ file, type: 'brochure' })); // default type
    setDocuments(prev => [...prev, ...newDocs]);
  };
  const updateDocumentType = (index, newType) => {
    setDocuments(prev => {
      const updated = [...prev];
      updated[index].type = newType;
      console.log("Updated document types:", updated);
      return updated;
    });
  };
const removeDocument = (index) => {
  setDocuments(prev => prev.filter((_, i) => i !== index));
};
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!basic.title || !basic.property_type || !location.latitude || !location.longitude) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    setIsSubmitting(true); 
    // Create the property data object with category_id included
    const correctedBasic = {
      category_id: basic.property_category,  // Map property_category to category_id
      property_type: basic.property_type,
      transaction_type: basic.transaction_type,
      title: basic.title,
      possession_status: basic.possession_status,
      expected_price: basic.expected_price,
      price_per_sqft: basic.price_per_sqft,
      developer_id: basic.developer_id
    };
    const propertyData = {
      basic: correctedBasic,
      details,
      location,
      nearest_to: nearestTo,
      amenities: selectedAmenities
    };
    if (editData) {
      // For update (PUT) requests - send direct JSON data
      console.log('Sending update data:', propertyData);
      
      // If we have new images, use FormData
      if (images.some(img => img instanceof File)) {
        alert('Image updates not supported yet. Please update property details without adding new images.');
        return;
      }
      
      // Send the update request with the fixed data structure
      await axios.put(
        `${BASE_URL}/api/property/${editData.id}`,
        propertyData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      alert('Property updated successfully!');
      if (onClose) onClose();
    } else {
      // For new property creation (POST) - use FormData
      const formData = new FormData();
      formData.append('data', JSON.stringify(propertyData));
      
      const meta = documents.map((doc, idx) => ({
        filename: doc.file.name,
        type: doc.type 
      }));
      console.log("Final documentMeta being sent:", meta);
      formData.append('documentMeta', JSON.stringify(meta));
      
      // Images are required for new properties
      if (images.length === 0) {
        alert('Please upload at least one image for new properties');
        return;
      }
      
      images.forEach(img => formData.append('images', img));
      documents.forEach((doc, idx) => {
        formData.append('documents', doc.file);
      });
      
      await axios.post(
        `${BASE_URL}/api/property`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    }
    
    alert(`Property ${editData ? 'updated' : 'added'} successfully!`);
    if (onClose) onClose();
  } catch (err) {
    console.error(err);
    alert('Error ' + (editData ? 'updating' : 'adding') + ' property: ' +
          (err.response?.data?.message || err.message));
  }finally {
    setIsSubmitting(false); // Reset loading state regardless of outcome
  }
};

const renderPropertySocietyDertails = ()=>{
    const selectedCategory = categories.find(
      cat => cat.id === parseInt(basic.property_category)
    )
    const categoryName = selectedCategory?.name || '';
    switch(categoryName){
      case 'Apartment/Flat':
        
          return(
            <>
              <div className="form-section">
          <div className="section-header">
            <h3>Society Details</h3>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Project Area*</label>
              <input 
                name="project_area" 
                value={details.project_area}
                onChange={handleDetailsChange}
                required
                placeholder="Enter propject area"
              />
            </div>
            <div className="form-group">
              <label>No of Tower in society</label>
              <input 
                name="no_of_tower" 
                value={details.no_of_tower}
                onChange={handleDetailsChange}
                required
                placeholder="no of towers"
              />
            </div>
          </div>

          <div className="form-row">
              <div className="form-group">
              <label>No of flat in society</label>
              <input 
                name="no_of_flat" 
                value={details.no_of_flat}
                onChange={handleDetailsChange}
                required
                placeholder="no of flat in society"
              />
              </div>
              <div className="form-group">
              <label>Project RERE Id</label>
              <input 
                name="project_rera_id" 
                value={details.project_rera_id}
                onChange={handleDetailsChange}
                required
                placeholder="project rera id"
              />
              </div>
          </div>  
        </div>
            </>
          )
    case 'Villa/House':
    return(
      <>
         <div className="form-section">
          <div className="section-header">
            <h3>Society Details</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Project Area*</label>
              <input 
                name="project_area" 
                value={details.project_area}
                onChange={handleDetailsChange}
                required
                placeholder="Enter propject area"
              />
            </div>
            <div className="form-group">
              <label>No of House/villa in society</label>
              <input 
                name="no_of_house" 
                value={details.no_of_house}
                onChange={handleDetailsChange}
                required
                placeholder="no of House/villa"
              />
            </div>
          </div>
          <div className="form-row">
          <div className="form-group">
              <label>Project RERE Id</label>
              <input 
                name="project_rera_id" 
                value={details.project_rera_id}
                onChange={handleDetailsChange}
                required
                placeholder="project rera id"
              />
              </div>
          </div>
         </div>
      </>
    )
    }
    
}
  // Render specific fields based on property type
  const renderPropertyCategoryFields = () => {
    const selectedCategory = categories.find(
      cat => cat.id === parseInt(basic.property_category)
    );
    const categoryName = selectedCategory?.name || '';
  
    const allFields = (
      <>
        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <input 
              type="number"
              name="bedrooms"
              value={details.bedrooms || ''}
              onChange={handleDetailsChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input 
              type="number"
              name="bathrooms"
              value={details.bathrooms || ''}
              onChange={handleDetailsChange}
              min="0"
            />
          </div>
        </div>
        <div className="form-row">
          {/* <div className="form-group">
            <label>Built-up Area (sqft)</label>
            <input 
              type="number"
              name="built_up_area"
              value={details.built_up_area || ''}
              onChange={handleDetailsChange}
              min="0"
            />
          </div> */}
          <div className="form-group">
            <label>Plot Area (sqft)</label>
            <input 
              type="number"
              name="plot_area"
              value={details.plot_area || ''}
              onChange={handleDetailsChange}
              min="0"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Furnished Status</label>
            <select
              name="furnished_status"
              value={details.furnished_status || ''}
              onChange={handleDetailsChange}
            >
              <option value="">Select</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully-Furnished">Fully-Furnished</option>
            </select>
          </div>
          <div className="form-group">
            <label>Facing</label>
            <select
              name="facing"
              value={details.facing || ''}
              onChange={handleDetailsChange}
            >
              <option value="">Select</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </select>
          </div>
        </div>
      </>
    );
  
    switch (categoryName) {
      case 'Apartment/Flat':
      
        return (
          <>
            <div className="form-row">
              <div className="form-group">
              <label>Bedrooms</label>
                  <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bedrooms"
                          value={num}
                          checked={parseInt(details.bedrooms) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3,].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bathrooms"
                          value={num}
                          checked={parseInt(details.bathrooms) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
              <label>Balconies</label>
              <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[0,1, 2, 3,].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="balconies"
                          value={num}
                          checked={parseInt(details.balconies) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
              <div className="form-group">
                <label>Facing</label>
                <select
                  name="facing"
                  value={details.facing || ''}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
              <label>Floor Number</label>
                <div className="floor-options ">
                  {["Lower Basement", "Upper Basement", "Ground", "1", "2", "3+"].map((option) => (
                    <label key={option} className={`radio-button ${details.floor === option ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="floor"
                        value={option}
                        checked={details.floor === option}
                        onChange={handleDetailsChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ''}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
            </div>
              
            <div className="form-row">
              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  name="furnished_status"
                  value={details.furnished_status || ''}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Covered Parking</label>
                <input
                  type="number"
                  name="covered_parking"
                  value={details.covered_parking || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                   {overlookingOptions.map(option => (
                  <label key={option} className="flex items-center gap-2">
                   <input
                  type="checkbox"
                    value={option}
                   checked={overlooking.includes(option)}
                     onChange={(e) => {
                  if (e.target.checked) {
                   setOverlooking([...overlooking, option]);
                    } else {
                    setOverlooking(overlooking.filter(item => item !== option));
                   }
                  }}
                 />
                 {option}
               </label>
               ))}
              </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Super Area</label>
                  <input type="number" name="super_built_up_area" value={details.super_built_up_area || ''} onChange={handleDetailsChange} min="0"/>
              </div>
              <div className="form-group">
                <label> Built-up Area (sqft)</label>
                <input
                  type="number"
                  name="built_up_area"
                  value={details.built_up_area || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Carpet Area (sqft)</label>
                <input
                  type="number"
                  name="carpet_area"
                  value={details.carpet_area || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select name='transaction_types' value={details.transaction_types || ''} onChange={handleDetailsChange}>
                  <option value="Resale">Resale</option>
                  <option value="New property">New Property</option>
                </select>
              </div>
              <div className="form-group">
              <label>Possession Status</label>
              <select 
                name="possession_status" 
                value={basic.possession_status}
                onChange={handleBasicChange}
              >
                <option value="">Select Status</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                
              </select>
            </div>
            <div className="form-group">
                <label htmlFor="available-from" className="block mb-2 font-medium">Available From</label>
                <input 
                  type="date" 
                  id="available-from"
                  name="available_from" 
                  value={details.available_from || ''} 
                  onChange={handleDetailsChange} // Changed to handleBasicChange if that's what other basic fields use
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
              <label>Expected Price*</label>
              <input 
                type="number" 
                name="expected_price" 
                value={basic.expected_price}
                onChange={handleBasicChange}
                required
                min="0"
                placeholder="Enter price in ₹"
              />
            </div>
            <div className="form-group">
              <label>Price per Sqft</label>
              <input 
                type="number" 
                name="price_per_sqft" 
                value={basic.price_per_sqft}
                onChange={handleBasicChange}
                min="0"
                placeholder="Enter price per sqft"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Booking Amount</label>
              <input 
                type="number" 
                name="booking_amount" 
                value={basic.booking_amount}
                onChange={handleDetailsChange}
                required
                min="0"
                placeholder="Enter booking amount"
              />
            </div>
            <div className="form-group">
              <label>Maintenance Charges</label>
              <input 
                type="number" 
                name="maintenance_charge" 
                value={basic.maintenance_charge}
                onChange={handleDetailsChange}
                min="0"
                placeholder="Enter price per sqft"
              />
            </div>
          </div>
          </>
        );
  
      case 'Villa/House':
      
        return (
          <>
            <div className="form-row">
              <div className="form-group">
              <label>Bedrooms</label>
                  <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bedrooms"
                          value={num}
                          checked={parseInt(details.bedrooms) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3,].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="bathrooms"
                          value={num}
                          checked={parseInt(details.bathrooms) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
              <label>Balconies</label>
              <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                    {[0,1, 2, 3,].map((num) => (
                      <label key={num} className="radio-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="balconies"
                          value={num}
                          checked={parseInt(details.balconies) === num}
                          onChange={handleDetailsChange}
                          style={{ accentColor: '#4a90e2' }}
                        />
                        <span style={{ marginLeft: '4px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
              </div>
              <div className="form-group">
                <label>Facing</label>
                <select
                  name="facing"
                  value={details.facing || ''}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>
            <div className="form-row">
             
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ''}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
            </div>
              
            <div className="form-row">
              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  name="furnished_status"
                  value={details.furnished_status || ''}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Covered Parking</label>
                <input
                  type="number"
                  name="covered_parking"
                  value={details.covered_parking || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                   {overlookingOptions.map(option => (
                  <label key={option} className="flex items-center gap-2">
                   <input
                  type="checkbox"
                    value={option}
                   checked={overlooking.includes(option)}
                     onChange={(e) => {
                  if (e.target.checked) {
                   setOverlooking([...overlooking, option]);
                    } else {
                    setOverlooking(overlooking.filter(item => item !== option));
                   }
                  }}
                 />
                 {option}
               </label>
               ))}
              </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Plot Area</label>
                  <input type="number" name="plot_area" value={details.plot_area || ''} onChange={handleDetailsChange} min="0"/>
              </div>
              <div className="form-group">
                <label> super Built-up Area (sqft)</label>
                <input
                  type="number"
                  name="super_built_up_area"
                  value={details.super_built_up_area || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              
            </div>
            <div className="form-row">
            <div className="form-group">
                <label>Carpet Area (sqft)</label>
                <input
                  type="number"
                  name="carpet_area"
                  value={details.carpet_area || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Plot Length (ft)</label>
                <input
                  type="number"
                  name="plot_length"
                  value={details.plot_length || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
                <label>Plot Width (ft)</label>
                <input
                  type="number"
                  name="plot_breadth"
                  value={details.plot_breadth || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>is this a corner Plot</label>
                <div className="radio-group" style={{ display: 'flex', gap: '10px' }}>
                  {["Yes", "No"].map((value) => (
                    <label 
                      key={value} 
                      className="radio-label" 
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="corner_plot"
                        value={value}
                        checked={details.corner_plot === value}
                        onChange={handleDetailsChange}
                        style={{ accentColor: '#4a90e2' }}
                      />
                      <span style={{ marginLeft: '4px' }}>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select name='transaction_types' value={details.transaction_types || ''} onChange={handleDetailsChange}>
                  <option value="Resale">Resale</option>
                  <option value="New property">New Property</option>
                </select>
              </div>
              <div className="form-group">
              <label>Possession Status</label>
              <select 
                name="possession_status" 
                value={basic.possession_status}
                onChange={handleBasicChange}
              >
                <option value="">Select Status</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                
              </select>
            </div>
            <div className="form-group">
                <label htmlFor="available-from" className="block mb-2 font-medium">Available From</label>
                <input 
                  type="date" 
                  id="available-from"
                  name="available_from" 
                  value={details.available_from || ''} 
                  onChange={handleDetailsChange} // Changed to handleBasicChange if that's what other basic fields use
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
              <label>Expected Price*</label>
              <input 
                type="number" 
                name="expected_price" 
                value={basic.expected_price}
                onChange={handleBasicChange}
                required
                min="0"
                placeholder="Enter price in ₹"
              />
            </div>
            <div className="form-group">
              <label>Price per Sqft</label>
              <input 
                type="number" 
                name="price_per_sqft" 
                value={basic.price_per_sqft}
                onChange={handleBasicChange}
                min="0"
                placeholder="Enter price per sqft"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Booking Amount</label>
              <input 
                type="number" 
                name="booking_amount" 
                value={basic.booking_amount}
                onChange={handleDetailsChange}
                required
                min="0"
                placeholder="Enter booking amount"
              />
            </div>
            <div className="form-group">
              <label>Maintenance Charges</label>
              <input 
                type="number" 
                name="maintenance_charge" 
                value={basic.maintenance_charge}
                onChange={handleDetailsChange}
                min="0"
                placeholder="Enter price per sqft"
              />
            </div>
          </div>
          </>
        );
  
      case 'Plot':
      case 'Land':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Plot Area (sqft)</label>
                <input
                  type="number"
                  name="plot_area"
                  value={details.plot_area || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Plot Length (ft)</label>
                <input
                  type="number"
                  name="plot_length"
                  value={details.plot_length || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Plot Width (ft)</label>
                <input
                  type="number"
                  name="plot_breadth"
                  value={details.plot_breadth || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Facing</label>
                <select
                  name="facing"
                  value={details.facing || ''}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
             
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Plot RERAID</label>
                <input
                  type="text"
                  name="project_rera_id"
                  value={details.project_rera_id || ''}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                {/* <label>Plot Length (ft)</label>
                <input
                  type="number"
                  name="plot_length"
                  value={details.plot_length || ''}
                  onChange={handleDetailsChange}
                  min="0"
                /> */}
              </div>
            </div>
          </>
        );
  
    
  
      default:
        return allFields;
    }
  };
  

  return (
    <div className="property-form-container">
     <div className="form-header">
  <h2>{editData ? 'Edit Property' : 'Add New Property'}</h2>
  <p>{editData ? 'Update the property details' : 'Fill in the details to list a new property'}</p>
</div>
      
      <form className="property-form" onSubmit={handleSubmit}>
          <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Property Title*</label>
              <input 
                name="title" 
                value={basic.title}
                onChange={handleBasicChange}
                required
                placeholder="Enter a descriptive title"
              />
            </div>
          </div>
            <div className="form-row">
            <div className="form-group">
              <label>Select Purpose</label>
              <select 
                name="transaction_type" 
                value={basic.transaction_type}
                onChange={handleBasicChange}
              >
                <option value="Sale">sale</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div className="form-group">
            <label>Property Category*</label>
              <select 
                name="property_category" 
                value={basic.property_category}
                onChange={handleBasicChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            </div>
            <div className="form-row">
            <div className="form-group">
  <label className="block mb-2 font-medium">Property Type*</label>
  <div className="space-y-2">
    {subcategories.map(subcategory => (
      <div key={subcategory.id} className="flex items-center">
        <input
          type="radio"
          id={`type-${subcategory.id}`}
          name="property_type"
          value={subcategory.id}
          checked={basic.property_type === subcategory.id.toString()} // Ensure string comparison
          onChange={(e) => {
            // Direct event handler to ensure proper update
            const updatedValue = {
              ...basic,
              property_type: e.target.value
            };
            setBasic(updatedValue); // Assuming you have a setBasic function
          }}
          disabled={!basic.property_category}
          className="mr-2 h-4 w-4"
          required
        />
        <label 
          htmlFor={`type-${subcategory.id}`} 
          className="cursor-pointer"
        >
          {subcategory.name}
        </label>
      </div>
    ))}
  </div>
</div>
             
            </div>
          </div>
        {/* Enter Society details */}
        {renderPropertySocietyDertails()}

        {/* Enter Location Details*/}
        <div className="form-section">
                <div className="section-header">
                  <h3>Enter Location details</h3>
                </div>
                <div className="form-row">
                <div className="form-group">
                <label>City*</label>
                <input 
                  name="city" 
                  value={details.city || ''}
                  onChange={handleDetailsChange}
                  required
                  placeholder="Enter city name"
                />
              </div>
              <div className="form-group">
                <label>Locality/Area</label>
                <input 
                  name="locality" 
                  value={details.locality || ''}
                  onChange={handleDetailsChange}
                  placeholder="Enter locality or area"
                />
              </div>
              </div>
              <div className="form-row">
              <div className="form-group">
                <label>Project Name</label>
                <input 
                  name="project_name" 
                  value={details.project_name || ''}
                  onChange={handleDetailsChange}
                  placeholder="Enter locality or area"
                />
              </div>
              <div className="form-group">
              <label>Developer</label>
              <select 
                name="developer_id" 
                value={basic.developer_id}
                onChange={handleBasicChange}
              >
                <option value="">Select Developer</option>
                {developers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
              </div>
                
        </div>
                {/* Location Picker */}
                <div className="form-section">
          <div className="section-header">
            <h3>Location</h3>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>Address*</label>
              <div className="address-input">
              <input 
              type="text"
               ref={addressInputRef}
               value={location.address}
               onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Enter complete address"
               required
              />
                <button 
                  type="button" 
                  className="search-btn"
                  onClick={handleAddressSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          
          <div className="map-container">
            <div id="map" style={{ height: '300px', width: '100%' }}></div>
            <button 
              type="button" 
              className="locate-me-btn"
              onClick={getCurrentLocation}
            >
              <MapPin size={16} /> Use My Location
            </button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input 
                type="text"
                value={location.latitude}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input 
                type="text"
                value={location.longitude}
                readOnly
              />
            </div>
          </div>
        </div>
        {basic.property_type && (
          <div className="form-section">
            <div className="section-header">
              <h3>Property Details</h3>
            </div>
            <div className="form-row">
             
              
            </div>
            
            {renderPropertyCategoryFields()}
            
           
          </div>
        )}



        {/* Amenities */}
        <div className="form-section">
          <div className="section-header">
            <h3>Amenities</h3>
          </div>
          
          <div className="amenities-container">
            {amenities.map(a => (
              <div key={a.id} className="amenity-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a.id)}
                    onChange={() => handleAmenityToggle(a.id)}
                  />
                  <span>{a.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest To */}
        <div className="form-section">
          <div className="section-header">
            <h3>Nearest Places</h3>
            <button type="button" className="add-btn" onClick={handleNearestAdd}>
              + Add Place
            </button>
          </div>
          
          {nearestTo.length > 0 ? (
            nearestTo.map((n, index) => (
              <div key={index} className="nearest-row">
                <div className="form-row">
                  <div className="form-group">
                    <select
                      value={n.nearest_to_id}
                      onChange={(e) => handleNearestChange(index, 'nearest_to_id', e.target.value)}
                    >
                      <option value="">Select Place</option>
                      {nearestOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      placeholder="Distance (km)"
                      value={n.distance_km}
                      onChange={(e) => handleNearestChange(index, 'distance_km', e.target.value)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => handleNearestRemove(index)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">No nearest places added yet</p>
          )}
        </div>

         {/* Images */}
          <div className="form-section image-section">
  <div className="section-header">
    <h3>Images</h3>
    <p>Upload high-quality images of the property</p>
  </div>
  
  <div className="form-row">
    <div className="form-group full-width">
      <input 
        id="property-images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="file-input"
      />
      <label htmlFor="property-images" className="file-upload-container">
        <svg 
          className="file-upload-icon" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
          <rect x="16" y="5" width="6" height="6" rx="1"></rect>
          <circle cx="10" cy="14" r="2"></circle>
          <line x1="20" y1="11" x2="20" y2="11"></line>
        </svg>
        <div className="file-upload-text">Drop images here or click to upload</div>
        <p className="file-help">Select multiple images (JPG, PNG)</p>
      </label>
    </div>
  </div>
  
  {images.length > 0 && (
    <div className="image-preview-container">
      {images.map((img, idx) => (
        <div key={idx} className="image-preview">
          <img 
            src={img instanceof File ? URL.createObjectURL(img) : img.url || img} 
            alt={`Preview ${idx}`} 
          />
          <button 
            type="button" 
            className="remove-image-btn"
            onClick={() => removeImage(idx)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>
 {/* document add section */}
 <div className="form-section">
  <div className="section-header">
    <h3>Documents</h3>
    {editData && <span className="helper-text">Optional - Upload only if you want to replace existing documents</span>}
  </div>

  <div className="document-upload">
    <label htmlFor="property-documents" className="upload-label">
      <input 
        id="property-documents"
        type="file" 
        multiple 
        onChange={handleDocumentChange}
      />
      <div className="upload-placeholder">
        <span>Drop documents here or click to upload</span>
        <small>Accepted: PDF, DOCX, JPG, PNG, MP4 (max 20 MB each)</small>
      </div>
    </label>

    {documents.map((docObj, idx) => (
  <li key={idx} className="file-item">
    {docObj.file.name}
    <select value={docObj.type} onChange={(e) => updateDocumentType(idx, e.target.value)}>
      <option value="brochure">Brochure</option>
      <option value="floor_plan">Floor Plan</option>
      <option value="rera_certificate">RERA Certificate</option>
      <option value="video">Video</option>
      <option value="1BHK">1BHK</option>
      <option value="2BHK">2BHK</option>
      <option value="3BHK">3BHK</option>
    </select>
    <button type="button" className="remove-btn" onClick={() => removeDocument(idx)}>❌</button>
  </li>
))}
    {editData && documents.length === 0 && (
      <div className="current-images-notice">
        <p>Using existing documents - new files not selected</p>
      </div>
    )}
  </div>
</div>
<div className="form-section">
    <div className="section-header">
      <h3>Youtube Link</h3>
      </div>
      <div className="form-row">
        <div className="form-group full-width">
        <input 
                type="text"
              
                name='youtube_link'
                value={details.youtube_link || ''}
                onChange={handleDetailsChange}
                placeholder='paste the youtube url here'
              />
          </div>    
      </div>
    
  </div>
    <div className="form-section">
      <div className="section-header">
        <h3>Peoperty Description</h3>
      </div>
    <div className="form-row">
              <div className="form-group full-width">
                
                <textarea
                  name="description"
                  value={details.description || ''}
                  onChange={handleDetailsChange}
                  rows="4"
                  placeholder="Describe the property in detail..."
                ></textarea>
              </div>
            </div>
            <div className="form-row">
            <div className="form-group full-width">
                <label>About Location</label>
                <textarea
                  name="about_location"
                  value={details.about_location || ''}
                  onChange={handleDetailsChange}
                  rows="4"
                  placeholder="Describe the property location in detail..."
                ></textarea>
              </div>
            </div>
    </div>

        <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
    Cancel
  </button>
  <button type="submit" className="submit-btn" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <span className="spinner"></span>
        {editData ? 'Updating...' : 'Adding...'}
      </>
    ) : (
      editData ? 'Update Property' : 'Add Property'
    )}
  </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;