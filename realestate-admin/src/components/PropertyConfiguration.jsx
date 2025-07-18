import React, { useState, useCallback, useEffect } from "react";
import { X, Upload, Edit, Trash } from "lucide-react";

const PropertyConfiguration = ({
  onAddConfiguration,
  initialConfigurations = [],
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBHK, setSelectedBHK] = useState("");
  const [configurations, setConfigurations] = useState([]);
  const [currentConfiguration, setCurrentConfiguration] = useState({
    bhk_type: "",
    bedrooms: "",
    bathrooms: "",
    super_built_up_area: "",
    carpet_area: "",
    balconies: "",
    pooja_room: "",
    servant_room: "",
    store_room: "",
    file: null,
    file_name: "",
    id: null, // Add ID for existing configurations
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const bhkOptions = [
    "1BHK",
    "2BHK",
    "2.5BHK",
    "3BHK",
    "3.5BHK",
    "4BHK",
    "4.5BHK",
    "5BHK",
    "6BHK",
    "7BHK",
    "8BHK",
    "9BHK",
    "10BHK",
  ];

  // Initialize configurations from props when component mounts or initialConfigurations change
  useEffect(() => {
    console.log("Initializing configurations:", initialConfigurations);
    if (initialConfigurations && initialConfigurations.length > 0) {
      // Map existing configurations to include proper structure
      const mappedConfigurations = initialConfigurations.map(
        (config, index) => ({
          ...config,
          id: config.id || `existing_${index}`, // Ensure each config has an ID
          isExisting: true, // Flag to identify existing configurations
        })
      );
      setConfigurations(mappedConfigurations);
    }
  }, [initialConfigurations]);

  // Use useCallback to memoize event handlers
  const handleBHKSelect = useCallback((bhk) => {
    setSelectedBHK(bhk);
    setCurrentConfiguration((prev) => ({
      ...prev,
      bhk_type: bhk,
      bedrooms: bhk.charAt(0),
      id: null,
      isExisting: false,
    }));
    setShowForm(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentConfiguration((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentConfiguration((prev) => ({
        ...prev,
        file,
        file_name: file.name,
      }));
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setCurrentConfiguration((prev) => ({
      ...prev,
      file: null,
      file_name: "",
    }));
  }, []);

  const handleEditConfiguration = useCallback(
    (index) => {
      const configToEdit = configurations[index];
      setCurrentConfiguration({
        ...configToEdit,
        // Don't include the file for existing configurations
        file: configToEdit.isExisting ? null : configToEdit.file,
      });
      setSelectedBHK(configToEdit.bhk_type);
      setShowForm(true);
      setIsEditing(true);
      setEditIndex(index);
    },
    [configurations]
  );

  const handleDeleteConfiguration = useCallback(
    (index) => {
      const configToDelete = configurations[index];
      const updatedConfigurations = configurations.filter(
        (_, i) => i !== index
      );
      setConfigurations(updatedConfigurations);

      // Prepare data for parent component with deletion info
      const configData = {
        configurations: updatedConfigurations,
        deletedConfigIds: configToDelete.isExisting ? [configToDelete.id] : [],
      };

      if (onAddConfiguration && typeof onAddConfiguration === "function") {
        try {
          onAddConfiguration(configData);
        } catch (error) {
          console.error("Error in onAddConfiguration:", error);
        }
      }
    },
    [configurations, onAddConfiguration]
  );

  const handleFormSubmit = useCallback(
    (e) => {
      // Prevent ALL default form behaviors
      if (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
          e.nativeEvent.preventDefault();
        }
      }

      // Validate required fields
      if (
        !currentConfiguration.bhk_type ||
        !currentConfiguration.bedrooms ||
        !currentConfiguration.bathrooms ||
        !currentConfiguration.super_built_up_area ||
        !currentConfiguration.carpet_area ||
        !currentConfiguration.balconies ||
        !currentConfiguration.pooja_room ||
        !currentConfiguration.servant_room ||
        !currentConfiguration.store_room === ""
      ) {
        alert("Please fill in all required fields");
        return false;
      }

      // For new configurations, file is required
      if (!isEditing && !currentConfiguration.file) {
        alert("Please upload a floorplan file for new configurations");
        return false;
      }

      let updatedConfigurations;
      let configToSave = { ...currentConfiguration };

      if (isEditing && editIndex !== null) {
        // For editing existing configurations
        updatedConfigurations = [...configurations];
        updatedConfigurations[editIndex] = configToSave;
      } else {
        // For new configurations
        configToSave.id = `new_${Date.now()}`;
        configToSave.isExisting = false;
        updatedConfigurations = [...configurations, configToSave];
      }

      // Update local state first
      setConfigurations(updatedConfigurations);

      // Reset form state
      setCurrentConfiguration({
        bhk_type: "",
        bedrooms: "",
        bathrooms: "",
        super_built_up_area: "",
        carpet_area: "",
        balconies: "",
        pooja_room: "",
        servant_room: "",
        store_room: "",
        file: null,
        file_name: "",
        id: null,
      });
      setSelectedBHK("");
      setShowForm(false);
      setIsEditing(false);
      setEditIndex(null);

      // Call the callback with updated configurations
      if (onAddConfiguration && typeof onAddConfiguration === "function") {
        setTimeout(() => {
          try {
            const configData = {
              configurations: updatedConfigurations,
              deletedConfigIds: [],
            };
            onAddConfiguration(configData);
          } catch (error) {
            console.error("Error in onAddConfiguration:", error);
          }
        }, 10);
      }

      return false;
    },
    [
      configurations,
      currentConfiguration,
      editIndex,
      isEditing,
      onAddConfiguration,
    ]
  );

  const handleFormCancel = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setShowForm(false);
    setSelectedBHK("");
    setCurrentConfiguration({
      bhk_type: "",
      bedrooms: "",
      bathrooms: "",
      super_built_up_area: "",
      carpet_area: "",
      balconies: "",
      pooja_room: "",
      servant_room: "",
      store_room: "",
      file: null,
      file_name: "",
      id: null,
    });
    setIsEditing(false);
    setEditIndex(null);
  }, []);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Property Configurations
        </h3>

        {/* Display existing configurations */}
        {configurations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3">
              Current Configurations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configurations.map((config, index) => (
                <div
                  key={config.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-800">
                      {config.bhk_type}
                    </h5>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditConfiguration(index)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit configuration"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteConfiguration(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete configuration"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Bedrooms: {config.bedrooms}</p>
                    <p>Bathrooms: {config.bathrooms}</p>
                    <p>Super Built-up: {config.super_built_up_area} sq ft</p>
                    <p>Carpet Area: {config.carpet_area} sq ft</p>
                    <p>Balconies: {config.balconies}</p>
                    <p>Pooja Rooms: {config.pooja_room}</p>
                    <p>Servant Rooms: {config.servant_room}</p>
                    <p>Store Rooms: {config.store_room}</p>
                    {config.file_name && (
                      <p className="text-blue-600">📎 {config.file_name}</p>
                    )}
                    {config.isExisting && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Existing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Configuration
          </label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  ${
                    selectedBHK === bhk
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleBHKSelect(bhk);
                }}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleFormCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {isEditing
                  ? `Edit ${selectedBHK} Configuration`
                  : `Add ${selectedBHK} Configuration`}
              </h4>
              <button
                type="button"
                onClick={handleFormCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={`bedroom-${num}`} className="flex items-center">
                      <input
                        type="radio"
                        name="bedrooms"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.bedrooms) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label
                      key={`bathroom-${num}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="bathrooms"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.bathrooms) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="super_built_up_area"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Super Built-up Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    id="super_built_up_area"
                    name="super_built_up_area"
                    value={currentConfiguration.super_built_up_area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="carpet_area"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Carpet Area/Plot Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    id="carpet_area"
                    name="carpet_area"
                    value={currentConfiguration.carpet_area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Balconies *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <label
                      key={`balconies-${num}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="balconies"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.balconies) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pooja Rooms *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <label
                      key={`pooja_room-${num}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="pooja_room"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.pooja_room) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servant Rooms *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <label
                      key={`servant_room-${num}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="servant_room"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.servant_room) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Rooms *
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <label
                      key={`store_room-${num}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        name="store_room"
                        value={num}
                        checked={
                          parseInt(currentConfiguration.store_room) === num
                        }
                        onChange={handleInputChange}
                        required
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floorplan Upload (PDF/JPG/PNG) {!isEditing && "*"}
                </label>

                {isEditing &&
                  currentConfiguration.isExisting &&
                  !currentConfiguration.file && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700">
                        Current file:{" "}
                        {currentConfiguration.file_name || "Existing floorplan"}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Upload a new file to replace the existing one (optional)
                      </p>
                    </div>
                  )}

                {!currentConfiguration.file &&
                !currentConfiguration.file_name ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="floorplan"
                      name="floorplan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required={!isEditing}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click or drag file to upload
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, JPG or PNG (Max. 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 text-sm text-gray-700 truncate">
                        {currentConfiguration.file_name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFile();
                      }}
                      className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFormCancel(e);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  {isEditing ? "Update Configuration" : "Add Configuration"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyConfiguration;
