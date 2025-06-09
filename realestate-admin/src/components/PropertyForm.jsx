import React, { useEffect, useState, useRef } from "react";
import PropertyConfiguration from "./PropertyConfiguration";
import axios from "axios";
import { Map, Building, Home, MapPin } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { convertToIndianWords } from "../utils.js";
import "./propertyForm.css";

const PropertyForm = ({ editData, onClose }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [basic, setBasic] = useState({
    property_category: "",
    property_type: "",
    transaction_type: "Sale",
    title: "",
    possession_status: "",
    expected_price: "",
    price_per_sqft: "",
    developer_id: "",
  });
  const [details, setDetails] = useState(
    editData?.details || {
      overlooking: [], // Initialize overlooking as an empty array within details
      facing: [],
    }
  );
  const [configurations, setConfigurations] = useState([]);
  const [configFileMeta, setConfigFileMeta] = useState([]);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });
  const [amenities, setAmenities] = useState([]);
  const [keyfeature, setKeyfeature] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedKeyfeature, setSelectedKeyfeature] = useState([]);
  const overlookingOptions = [
    "Pool",
    "Park",
    "Road",
    "Garden",
    "Sea",
    "River",
    "Club",
    "Temple",
  ];
  const otherroomsOptions = [
    "Pooja Room",
    "Study Room",
    "Guest Room",
    "Servent Room",
    "Store Room",
  ];
  const facingOptions = [
    "East",
    "West",
    "North",
    "South",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];
  const [developers, setDevelopers] = useState([]);
  const [nearestOptions, setNearestOptions] = useState([]);
  const [nearestTo, setNearestTo] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const [documentErrors, setDocumentErrors] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);

  // edit property
  useEffect(() => {
    if (editData) {
      // Populate basic information
      setBasic({
        property_category: editData.category_id || "",
        property_type: editData.property_type || "",
        transaction_type: editData.transaction_type || "Sale",
        title: editData.title || "",
        possession_status: editData.possession_status || "",
        expected_price: editData.expected_price || "",
        price_per_sqft: editData.price_per_sqft || "",
        developer_id: editData.developer_id || "",
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
        ["city", "locality", "description"].forEach((field) => {
          if (editData[field]) detailsFields[field] = editData[field];
        });
        const categoryName = editData.property_category_name;
        // Specific fields based on property type
        if (categoryName === "Apartment") {
          [
            "bedrooms",
            "bathrooms",
            "floor",
            "total_floors",
            "built_up_area",
            "facing",
            "locality",
            "bedrooms",
            "balconies",
            "bathrooms",
            "project_area",
            "no_of_flat",
            "overlooking",
            "booking_amount",
            "maintenance_charge",
            "transaction_types",
            "available_from",
            "project_rera_id",
            "carpet_area",
            "furnished_status",
            "covered_parking",
            "project_name",
            "no_of_tower",
            "super_built_up_area",
            "youtube_link",
            "about_location",
            "available_from",
            "other_rooms",
            "rental_return",
            "property_status"
          ].forEach((field) => {
            if (editData[field] !== undefined)
              detailsFields[field] = editData[field];
          });
        } else if (categoryName === "House/Villa") {
          [
            "bedrooms",
            "bathrooms",
            "floor",
            "total_floors",
            "built_up_area",
            "facing",
            "locality",
            "bedrooms",
            "balconies",
            "bathrooms",
            "project_area",
            "no_of_flat",
            "overlooking",
            "booking_amount",
            "maintenance_charge",
            "transaction_types",
            "available_from",
            "project_rera_id",
            "carpet_area",
            "furnished_status",
            "covered_parking",
            "project_name",
            "no_of_tower",
            "super_built_up_area",
            "youtube_link",
            "about_location",
            "available_from",
            "no_of_house",
            "plot_area",
            "plot_breadth",
            "plot_length",
            "corner_plot",
            "other_rooms",
            "rental_return",
            "property_status"
          ].forEach((field) => {
            if (editData[field] !== undefined)
              detailsFields[field] = editData[field];
          });
        } else if (
          categoryName === "Project Apartment" ||
          categoryName === "Project House/Villa"
        ) {
          [
            "bedrooms",
            "bathrooms",
            "floor",
            "total_floors",
            "built_up_area",
            "facing",
            "locality",
            "bedrooms",
            "balconies",
            "bathrooms",
            "project_area",
            "no_of_flat",
            "overlooking",
            "booking_amount",
            "maintenance_charge",
            "transaction_types",
            "available_from",
            "project_rera_id",
            "carpet_area",
            "furnished_status",
            "covered_parking",
            "project_name",
            "no_of_tower",
            "super_built_up_area",
            "youtube_link",
            "about_location",
            "available_from",
            "rental_return",
            "property_status"
          ].forEach((field) => {
            if (editData[field] !== undefined)
              detailsFields[field] = editData[field];
          });
        } else if (categoryName === "Hostel") {
          ["total_rooms", "room_sharing", "furnished_status"].forEach(
            (field) => {
              if (editData[field] !== undefined)
                detailsFields[field] = editData[field];
            }
          );
        }

        setDetails(detailsFields);
      }
      // edit images
      if (editData && editData.images && Array.isArray(editData.images)) {
        // Convert image URLs to a format your component can display
        const existingImages = editData.images.map((img) => ({
          url: img.image_url,
          id: img.id,
          is_primary: img.is_primary,
        }));
        setImages(existingImages);
      }
      // edit document
      if (editData && editData.documents && Array.isArray(editData.documents)) {
        // Convert document data to the format expected by your component
        const existingDocs = editData.documents.map((doc) => ({
          file: { name: doc.type.replace(/_/g, " ") + " file" }, // Get filename from URL or use type as name
          type: doc.type,
          url: doc.file_url,
          id: doc.id,
        }));
        setDocuments(existingDocs);
      }
      // Rest of the existing useEffect code...
      setLocation({
        latitude: editData.latitude || "",
        longitude: editData.longitude || "",
        address: editData.address || "",
      });

      if (map && marker && editData.latitude && editData.longitude) {
        const position = {
          lat: parseFloat(editData.latitude),
          lng: parseFloat(editData.longitude),
        };
        map.setCenter(position);
        marker.setPosition(position);
      }

      if (editData.amenities && Array.isArray(editData.amenities)) {
        setSelectedAmenities(
          editData.amenities.map((a) => (typeof a === "object" ? a.id : a))
        );
      }
      if (editData.key_features && Array.isArray(editData.key_features)) {
        console.log("Setting key features:", editData.key_features);
        setSelectedKeyfeature(
          editData.key_features.map((kf) =>
            typeof kf === "object" ? kf.id : kf
          )
        );
      }
      if (editData.nearest_to && Array.isArray(editData.nearest_to)) {
        setNearestTo(
          editData.nearest_to.map((n) => ({
            nearest_to_id: n.id,
            distance_km: n.distance_km,
          }))
        );
      }
    }
  }, [editData, map, marker]);
  useEffect(() => {
    if (
      editData &&
      editData.keyfeature &&
      Array.isArray(editData.keyfeature) &&
      keyfeature.length > 0
    ) {
      setSelectedKeyfeature(
        editData.keyfeature.map((a) => (typeof a === "object" ? a.id : a))
      );
    }
  }, [keyfeature]);
  // calculate the price for square feet automatically
  useEffect(() => {
    const area = parseFloat(details.super_built_up_area);
    const price = parseFloat(basic.expected_price);

    if (!isNaN(area) && area > 0 && !isNaN(price)) {
      const pricePerSqft = Math.round(price / area);
      setBasic((prev) => ({ ...prev, price_per_sqft: pricePerSqft }));
    }
  }, [details.super_built_up_area, basic.expected_price]);

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          amenityRes,
          developerRes,
          nearestRes,
          categoryRes,
          keyfeatureRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/amenities`),
          axios.get(`${BASE_URL}/api/developer`),
          axios.get(`${BASE_URL}/api/nearest`),
          axios.get(`${BASE_URL}/api/category`),
          axios.get(`${BASE_URL}/api/keyfeature`),
        ]);

        setAmenities(amenityRes.data);
        setDevelopers(developerRes.data);
        setNearestOptions(nearestRes.data);
        setCategories(categoryRes.data);
        setKeyfeature(keyfeatureRes.data);
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
      const response = await axios.get(
        `${BASE_URL}/api/subcategory/${categoryId}`,
        {
          withCredentials: true,
        }
      );
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
      const script = document.createElement("script");
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

    const defaultLocation = { lat: 28.6139, lng: 77.209 }; // Delhi, India

    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: defaultLocation,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
      }
    );

    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
    });

    setLocation({
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lng,
      address: "",
    });

    // Map click to update marker and reverse geocode
    mapInstance.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      markerInstance.setPosition({ lat, lng });
      setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocation((prev) => ({
            ...prev,
            address: results[0].formatted_address,
          }));
        }
      });
    });

    // Marker drag to update location
    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      const lat = position.lat();
      const lng = position.lng();

      setLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocation((prev) => ({
            ...prev,
            address: results[0].formatted_address,
          }));
        }
      });
    });

    // Setup autocomplete on address input
    if (addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
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
              if (status === "OK" && results[0]) {
                setLocation((prev) => ({
                  ...prev,
                  address: results[0].formatted_address,
                }));
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
    setBasic((prev) => ({ ...prev, [name]: value }));

    // When category changes, fetch subcategories and reset property_type
    if (name === "property_category") {
      fetchSubcategories(value);
      setBasic((prev) => ({ ...prev, property_type: "" }));
      setDetails({});
    }
  };
  const handleAddConfigurations = (configList) => {
    // Extract file metadata for API call
    const fileMeta = configList
      .filter((config) => config.file && config.file_name)
      .map((config) => ({
        bhk_type: config.bhk_type,
        file_name: config.file_name,
      }));

    setConfigurations(configList);
    setConfigFileMeta(fileMeta);
  };
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleOverlookingChange = (option, isChecked) => {
    const currentOverlooking = details.overlooking || [];
    let newOverlooking;

    if (isChecked) {
      newOverlooking = [...currentOverlooking, option];
    } else {
      newOverlooking = currentOverlooking.filter((item) => item !== option);
    }

    // Update the details object with the new overlooking array
    setDetails((prev) => ({
      ...prev,
      overlooking: newOverlooking,
    }));
  };
  const handleOtherroomsChange = (option, isChecked) => {
    const currentOtherrooms = details.other_rooms || [];
    let newOtherrooms;
    if (isChecked) {
      newOtherrooms = [...currentOtherrooms, option];
    } else {
      newOtherrooms = currentOtherrooms.filter((item) => item !== option);
    }
    setDetails((prev) => ({ ...prev, other_rooms: newOtherrooms }));
  };
  const handleFacingChange = (option, isChecked) => {
    const currentFacing = details.facing || [];
    let newFacing;
    if (isChecked) {
      newFacing = [...currentFacing, option];
    } else {
      newFacing = currentFacing.filter((item) => item !== option);
    }
    setDetails((prev) => ({ ...prev, facing: newFacing }));
  };
  const handleAddressSearch = () => {
    if (!window.google || !map) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location.address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();

        map.setCenter({ lat, lng });
        marker.setPosition({ lat, lng });
        setLocation({
          latitude: lat,
          longitude: lng,
          address: location.address,
        });
      } else {
        alert("Address not found. Please try again.");
      }
    });
  };

  const handleAmenityToggle = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleKeyfeatureToggle = (id) => {
    setSelectedKeyfeature((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleNearestAdd = () => {
    setNearestTo([...nearestTo, { nearest_to_id: "", distance_km: "" }]);
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
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  const validFiles = [];
  const errors = [];

  // First check file sizes
  selectedFiles.forEach((file) => {
    if (file.size > maxSize) {
      errors.push(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit`);
    } else {
      validFiles.push(file);
    }
  });

  // Then filter duplicates from valid files
  const filtered = validFiles.filter(
    (newFile) =>
      !images.some(
        (existing) =>
          existing.name === newFile.name && existing.size === newFile.size
      )
  );

  setImageErrors(errors);
  
  if (filtered.length > 0) {
    setImages((prev) => [...prev, ...filtered]);
  }
  
  // Clear the input
  e.target.value = '';
};

  const removeImage = (idx) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(idx, 1);

      // Update main image index if needed
      if (mainImageIndex === idx) {
        setMainImageIndex(0);
      } else if (mainImageIndex > idx) {
        setMainImageIndex((prevIndex) => prevIndex - 1);
      }

      return newImages;
    });
  };

const handleDocumentChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  const validFiles = [];
  const errors = [];

  selectedFiles.forEach((file) => {
    if (file.size > maxSize) {
      errors.push(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit`);
    } else {
      validFiles.push({
        file: file,
        type: "brochure" // default type
      });
    }
  });

  setDocumentErrors(errors);
  
  if (validFiles.length > 0) {
    setDocuments((prev) => [...prev, ...validFiles]);
  }
  
  // Clear the input
  e.target.value = '';
};
  const updateDocumentType = (index, newType) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index].type = newType;
      console.log("Updated document types:", updated);
      return updated;
    });
  };
  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !basic.title ||
      !basic.property_type ||
      !location.latitude ||
      !location.longitude
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      // Create the property data object with category_id included
      const correctedBasic = {
        category_id: basic.property_category, // Map property_category to category_id
        property_type: basic.property_type,
        transaction_type: basic.transaction_type,
        title: basic.title,
        possession_status: basic.possession_status,
        expected_price: basic.expected_price,
        price_per_sqft: basic.price_per_sqft,
        developer_id: basic.developer_id,
      };
      // const createpropertyConfig = {
      //   bhk_type:configuration.bhk_type,
      //   bedrooms:configuration.bedrooms,
      //   bathrooms:configuration.bathrooms,
      //   balconies:configuration.balconies,
      //   carpet_area:configuration.carpet_area,
      //   super_built_up_area:configuration.super_built_up_area
      // }
      const propertyData = {
        basic: correctedBasic,
        configurations: configurations,
        details,
        location,

        nearest_to: nearestTo,
        amenities: selectedAmenities,
        keyfeature: selectedKeyfeature,
      };
      if (editData) {
        // For update (PUT) requests - send direct JSON data
        console.log("Sending update data:", propertyData);

        // If we have new images, use FormData
        if (images.some((img) => img instanceof File)) {
          alert(
            "Image updates not supported yet. Please update property details without adding new images."
          );
          return;
        }

        // Send the update request with the fixed data structure
        await axios.put(
          `${BASE_URL}/api/property/${editData.id}`,
          propertyData,
          { headers: { "Content-Type": "application/json" } }
        );

        alert("Property updated successfully!");
        if (onClose) onClose();
      } else {
        // For new property creation (POST) - use FormData
        const formData = new FormData();
        formData.append("data", JSON.stringify(propertyData));

        const meta = documents.map((doc, idx) => ({
          filename: doc.file.name,
          type: doc.type,
        }));
        console.log("Final documentMeta being sent:", meta);
        formData.append("documentMeta", JSON.stringify(meta));
        formData.append("configFileMeta", JSON.stringify(configFileMeta));
        // Add configuration files to FormData
        configurations.forEach((config) => {
          if (config.file) {
            formData.append("configFiles", config.file);
          }
        });
        // Images are required for new properties
        if (images.length === 0) {
          alert("Please upload at least one image for new properties");
          return;
        }

        images.forEach((img) => formData.append("images", img));
        documents.forEach((doc, idx) => {
          formData.append("documents", doc.file);
        });

        await axios.post(`${BASE_URL}/api/property`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }

      alert(`Property ${editData ? "updated" : "added"} successfully!`);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert(
        "Error " +
          (editData ? "updating" : "adding") +
          " property: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of outcome
    }
  };

  const renderPropertySocietyDertails = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(basic.property_category)
    );
    const categoryName = selectedCategory?.name || "";
    switch (categoryName) {
      case "Apartment":
      case "Project Apartment":
        return (
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
                  <label>Project RERA Id</label>
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
        );
      case "House/Villa":
      case "Project House/Villa":
        return (
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
                  <label>Project RERA Id</label>
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
        );
    }
  };
  // Render specific fields based on property type
  const renderPropertyCategoryFields = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(basic.property_category)
    );
    const categoryName = selectedCategory?.name || "";

    const allFields = (
      <>
        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={details.bedrooms || ""}
              onChange={handleDetailsChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={details.bathrooms || ""}
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
              value={details.plot_area || ""}
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
              value={details.furnished_status || ""}
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
              value={details.facing || ""}
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
      case "Project House/Villa":
        return (
          <>
            <section className="form-section">
              <PropertyConfiguration
                onAddConfiguration={handleAddConfigurations}
              />
            </section>
            <div className="form-row">
              <div className="form-group">
                <label>Other rooms</label>
                <div className="flex flex-row flex-wrap gap-4">
                  {" "}
                  {/* Changed to flex-row with flex-wrap and increased gap */}
                  {otherroomsOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-1"
                        checked={details.other_rooms?.includes(option)}
                        onChange={(e) =>
                          handleOtherroomsChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Facing</label>
                <div className="grid grid-cols-2 gap-2">
                  {facingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.facing?.includes(option)}
                        onChange={(e) =>
                          handleFacingChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  name="furnished_status"
                  value={details.furnished_status || ""}
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
                  value={details.covered_parking || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                  {overlookingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.overlooking?.includes(option)}
                        onChange={(e) =>
                          handleOverlookingChange(option, e.target.checked)
                        }
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
                <input
                  type="number"
                  name="plot_area"
                  value={details.plot_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>is this a corner Plot</label>
                <div
                  className="radio-group"
                  style={{ display: "flex", gap: "10px" }}
                >
                  {["Yes", "No"].map((value) => (
                    <label
                      key={value}
                      className="radio-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="corner_plot"
                        value={value}
                        checked={details.corner_plot === value}
                        onChange={handleDetailsChange}
                        style={{ accentColor: "#4a90e2" }}
                      />
                      <span style={{ marginLeft: "4px" }}>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Plot Width (ft)</label>
                <input
                  type="number"
                  name="plot_breadth"
                  value={details.plot_breadth || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Plot Length (ft)</label>
                <input
                  type="number"
                  name="plot_length"
                  value={details.plot_length || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="transaction_types"
                  value={details.transaction_types || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select Status</option>
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
                <label
                  htmlFor="available-from"
                  className="block mb-2 font-medium"
                >
                  Available From
                </label>
                <input
                  type="date"
                  id="available-from"
                  name="available_from"
                  value={details.available_from || ""}
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
                {basic.expected_price && (
                  <small className="text-sm text-gray-600 block mt-1">
                    {convertToIndianWords(parseInt(basic.expected_price))}
                  </small>
                )}
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
                  value={details.booking_amount}
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
                  value={details.maintenance_charge}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div className="form-row">
               <div className="form-group">
                <label>Expected Rental Return</label>
                <input
                  type="number"
                  name="rental_return"
                  value={details.rental_return}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price "
                />
              </div>
              <div className="form-group"></div>
            </div>
          </>
        );
      case "Project Apartment":
        return (
          <>
            <section className="form-section">
              <PropertyConfiguration
                onAddConfiguration={handleAddConfigurations}
              />
            </section>
            <div className="form-row">
              <div className="form-group">
                <label>Facing</label>
                <div className="grid grid-cols-2 gap-2">
                  {facingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.facing?.includes(option)}
                        onChange={(e) =>
                          handleFacingChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
              <div className="form-group"></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  name="furnished_status"
                  value={details.furnished_status || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Covered Parking</label>
                <input
                  type="number"
                  name="covered_parking"
                  value={details.covered_parking || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                  {overlookingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.overlooking?.includes(option)}
                        onChange={(e) =>
                          handleOverlookingChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="transaction_types"
                  value={details.transaction_types || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select Status</option>
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
                <label
                  htmlFor="available-from"
                  className="block mb-2 font-medium"
                >
                  Available From
                </label>
                <input
                  type="date"
                  id="available-from"
                  name="available_from"
                  value={
                    details.available_from
                      ? details.available_from.slice(0, 10)
                      : ""
                  }
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
                {basic.expected_price && (
                  <small className="text-sm text-gray-600 block mt-1">
                    {convertToIndianWords(parseInt(basic.expected_price))}
                  </small>
                )}
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
                  value={details.booking_amount}
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
                  value={details.maintenance_charge}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price"
                />
              </div>
            </div>
              <div className="form-row">
               <div className="form-group">
                <label>Expected Rental Return</label>
                <input
                  type="number"
                  name="rental_return"
                  value={details.rental_return}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price "
                />
              </div>
              <div className="form-group"></div>
            </div>
          </>
        );
      case "Apartment":
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={details.bedrooms || ""}
                  onChange={handleDetailsChange}
                  min={0}
                  className="form-control"
                  placeholder="Enter number of bedrooms"
                />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={details.bathrooms || ""}
                  onChange={handleDetailsChange}
                  min={0}
                  className="form-control"
                  placeholder="Enter number of bathrooms"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Other rooms</label>
                <div className="flex flex-row flex-wrap gap-4">
                  {" "}
                  {/* Changed to flex-row with flex-wrap and increased gap */}
                  {otherroomsOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-1"
                        checked={details.other_rooms?.includes(option)}
                        onChange={(e) =>
                          handleOtherroomsChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Balconies</label>
                <input
                  type="number"
                  name="balconies"
                  value={details.balconies || ""}
                  onChange={handleDetailsChange}
                  min={0}
                  className="form-control"
                  placeholder="Enter number of bathrooms"
                />
              </div>
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Property In Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={details.floor || ""}
                  onChange={handleDetailsChange}
                  className="form-control"
                  placeholder='e.g., "Ground", "1", "3+", "Upper Basement"'
                />
              </div>
              <div className="form-group">
                <label>Number of Covered Parking</label>
                <input
                  type="number"
                  name="covered_parking"
                  value={details.covered_parking || ""}
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
                  value={details.furnished_status || ""}
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
                <div className="grid grid-cols-2 gap-2">
                  {facingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.facing?.includes(option)}
                        onChange={(e) =>
                          handleFacingChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                  {overlookingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.overlooking?.includes(option)}
                        onChange={(e) =>
                          handleOverlookingChange(option, e.target.checked)
                        }
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
                <input
                  type="number"
                  name="super_built_up_area"
                  value={details.super_built_up_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label> Built-up Area (sqft)</label>
                <input
                  type="number"
                  name="built_up_area"
                  value={details.built_up_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Carpet Area (sqft)</label>
                <input
                  type="number"
                  name="carpet_area"
                  value={details.carpet_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="transaction_types"
                  value={details.transaction_types || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select Status</option>
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
                <label
                  htmlFor="available-from"
                  className="block mb-2 font-medium"
                >
                  Available From
                </label>
                <input
                  type="date"
                  id="available-from"
                  name="available_from"
                  value={
                    details.available_from
                      ? details.available_from.slice(0, 10)
                      : ""
                  }
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
                {basic.expected_price && (
                  <small className="text-sm text-gray-600 block mt-1">
                    {convertToIndianWords(parseInt(basic.expected_price))}
                  </small>
                )}
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
                  value={details.booking_amount}
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
                  value={details.maintenance_charge}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price per sqft"
                />
              </div>
            </div>
              <div className="form-row">
               <div className="form-group">
                <label>Expected Rental Return</label>
                <input
                  type="number"
                  name="rental_return"
                  value={details.rental_return}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price "
                />
              </div>
              <div className="form-group"></div>
            </div>
          </>
        );

      case "House/Villa":
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={details.bedrooms || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={details.bathrooms || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Other rooms</label>
                <div className="flex flex-row flex-wrap gap-4">
                  {" "}
                  {/* Changed to flex-row with flex-wrap and increased gap */}
                  {otherroomsOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-1"
                        checked={details.other_rooms?.includes(option)}
                        onChange={(e) =>
                          handleOtherroomsChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Balconies</label>
                <input
                  type="number"
                  name="balconies"
                  value={details.balconies || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Total Floors</label>
                <input
                  type="number"
                  name="total_floors"
                  value={details.total_floors || ""}
                  onChange={handleDetailsChange}
                  min="1"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Facing</label>
                <div className="grid grid-cols-2 gap-2">
                  {facingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.facing?.includes(option)}
                        onChange={(e) =>
                          handleFacingChange(option, e.target.checked)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Furnished Status</label>
                <select
                  name="furnished_status"
                  value={details.furnished_status || ""}
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
                  value={details.covered_parking || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Overlooking</label>
                <div className="grid grid-cols-2 gap-2">
                  {overlookingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        className="mr-2"
                        checked={details.overlooking?.includes(option)}
                        onChange={(e) =>
                          handleOverlookingChange(option, e.target.checked)
                        }
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
                <input
                  type="number"
                  name="plot_area"
                  value={details.plot_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label> super Built-up Area (sqft)</label>
                <input
                  type="number"
                  name="super_built_up_area"
                  value={details.super_built_up_area || ""}
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
                  value={details.carpet_area || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Plot Length (ft)</label>
                <input
                  type="number"
                  name="plot_length"
                  value={details.plot_length || ""}
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
                  value={details.plot_breadth || ""}
                  onChange={handleDetailsChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>is this a corner Plot</label>
                <div
                  className="radio-group"
                  style={{ display: "flex", gap: "10px" }}
                >
                  {["Yes", "No"].map((value) => (
                    <label
                      key={value}
                      className="radio-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="corner_plot"
                        value={value}
                        checked={details.corner_plot === value}
                        onChange={handleDetailsChange}
                        style={{ accentColor: "#4a90e2" }}
                      />
                      <span style={{ marginLeft: "4px" }}>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="transaction_types"
                  value={details.transaction_types || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">Select Status</option>
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
                <label
                  htmlFor="available-from"
                  className="block mb-2 font-medium"
                >
                  Available From
                </label>
                <input
                  type="date"
                  id="available-from"
                  name="available_from"
                  value={details.available_from || ""}
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
                {basic.expected_price && (
                  <small className="text-sm text-gray-600 block mt-1">
                    {convertToIndianWords(parseInt(basic.expected_price))}
                  </small>
                )}
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
                  value={details.booking_amount}
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
                  value={details.maintenance_charge}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price per sqft"
                />
              </div>
            </div>
              <div className="form-row">
               <div className="form-group">
                <label>Expected Rental Return</label>
                <input
                  type="number"
                  name="rental_return"
                  value={details.rental_return}
                  onChange={handleDetailsChange}
                  min="0"
                  placeholder="Enter price "
                />
              </div>
              <div className="form-group"></div>
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
        <h2>{editData ? "Edit Property" : "Add New Property"}</h2>
        <p>
          {editData
            ? "Update the property details"
            : "Fill in the details to list a new property"}
        </p>
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
                <option value="Sale">Sale</option>
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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="block mb-2 font-medium">Property Type*</label>
              <div className="space-y-2">
                {subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`type-${subcategory.id}`}
                      name="property_type"
                      value={subcategory.id}
                      checked={
                        basic.property_type === subcategory.id.toString()
                      } // Ensure string comparison
                      onChange={(e) => {
                        // Direct event handler to ensure proper update
                        const updatedValue = {
                          ...basic,
                          property_type: e.target.value,
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
            {/* propety status check */}
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Project
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Yes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="property_status"
                  checked={details.property_status === 'active'}
                  onChange={(e) =>
                    handleDetailsChange({
                      target: {
                        name: 'property_status',
                        value: e.target.checked ? 'active' : 'inactive',
                      },
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                <span className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-full"></span>
              </label>
              <span className="text-sm text-gray-600">No</span>
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
                value={details.city || ""}
                onChange={handleDetailsChange}
                required
                placeholder="Enter city name"
              />
            </div>
            <div className="form-group">
              <label>Locality/Area</label>
              <input
                name="locality"
                value={details.locality || ""}
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
                value={details.project_name || ""}
                onChange={handleDetailsChange}
                placeholder="Enter project name"
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
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.company_name}
                  </option>
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
                  onChange={(e) =>
                    setLocation({ ...location, address: e.target.value })
                  }
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
            <div id="map" style={{ height: "300px", width: "100%" }}></div>
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
              <input type="text" value={location.latitude} readOnly />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input type="text" value={location.longitude} readOnly />
            </div>
          </div>
        </div>
        {basic.property_type && (
          <div className="form-section">
            <div className="section-header">
              <h3>Property Details</h3>
            </div>
            <div className="form-row"></div>

            {renderPropertyCategoryFields()}
          </div>
        )}

        {/* Amenities */}
        <div className="form-section">
          <div className="section-header">
            <h3>Amenities</h3>
          </div>

          <div className="amenities-container">
            {amenities.map((a) => (
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

        {/* keyfeatures */}
        <div className="form-section">
          <div className="section-header">
            <h3>Key Feature</h3>
          </div>

          <div className="amenities-container">
            {keyfeature.map((a) => (
              <div key={a.id} className="amenity-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedKeyfeature.includes(a.id)}
                    onChange={() => handleKeyfeatureToggle(a.id)}
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
            <button
              type="button"
              className="add-btn"
              onClick={handleNearestAdd}
            >
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
                      onChange={(e) =>
                        handleNearestChange(
                          index,
                          "nearest_to_id",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Place</option>
                      {nearestOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Distance (km)"
                      value={n.distance_km}
                      onChange={(e) =>
                        handleNearestChange(
                          index,
                          "distance_km",
                          e.target.value
                        )
                      }
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
      <label
        htmlFor="property-images"
        className="file-upload-container"
      >
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
        <div className="file-upload-text">
          Drop images here or click to upload
        </div>
        <p className="file-help">
          Select multiple images (JPG, PNG). Max size: 10MB each.
        </p>
      </label>
    </div>
  </div>

  {/* Error messages for images */}
  {imageErrors.length > 0 && (
    <div className="file-errors">
      <h4>Images not accepted:</h4>
      <ul>
        {imageErrors.map((error, idx) => (
          <li key={idx} className="error-item">
            {error}
          </li>
        ))}
      </ul>
    </div>
  )}

  {images.length > 0 && (
    <div className="image-preview-container">
      {images.map((img, idx) => (
        <div key={idx} className="image-preview">
          <img
            src={
              img instanceof File
                ? URL.createObjectURL(img)
                : img.url || img
            }
            alt={`Preview ${idx}`}
          />
          <div className="image-actions">
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => removeImage(idx)}
            >
              ×
            </button>

            <button
              type="button"
              className={`main-image-btn ${
                mainImageIndex === idx ? "active" : ""
              }`}
              onClick={() => setMainImageIndex(idx)}
            >
              {mainImageIndex === idx ? "Main Image ✓" : "Set as Main"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
       {/* Updated JSX for Document Section */}
          <div className="form-section">
            <div className="section-header">
              <h3>Documents</h3>
              {editData && (
                <span className="helper-text">
                  Optional - Upload only if you want to replace existing documents
                </span>
              )}
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
                  <small>
                    Accepted: PDF, DOCX, JPG, PNG, MP4 (max 10 MB each)
                  </small>
                </div>
              </label>

              {/* Error messages for documents */}
              {documentErrors.length > 0 && (
                <div className="file-errors">
                  <h4>Files not accepted:</h4>
                  <ul>
                    {documentErrors.map((error, idx) => (
                      <li key={idx} className="error-item">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {documents.map((docObj, idx) => (
                <li key={idx} className="file-item">
                  {docObj.file.name}
                  <select
                    value={docObj.type}
                    onChange={(e) => updateDocumentType(idx, e.target.value)}
                  >
                    <option value="brochure">Brochure</option>
                    <option value="floorplan">Floor Plan</option>
                    <option value="Masterplan">Master Plan</option>
                    <option value="Approval">Approval</option>
                    <option value="rerecirtificate">RERA Certificate</option>
                  </select>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeDocument(idx)}
                  >
                    ❌
                  </button>
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
                name="youtube_link"
                value={details.youtube_link || ""}
                onChange={handleDetailsChange}
                placeholder="paste the youtube url here"
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
              <label>Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={details.description || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleDetailsChange({
                    target: { name: "description", value: data },
                  });
                }}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>About Location</label>
              <CKEditor
                editor={ClassicEditor}
                data={details.about_location || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleDetailsChange({
                    target: { name: "about_location", value: data },
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {editData ? "Updating..." : "Adding..."}
              </>
            ) : editData ? (
              "Update Property"
            ) : (
              "Add Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
