import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload, Edit, Trash } from 'lucide-react';

const PropertyConfiguration = ({ onAddConfiguration, initialConfigurations = [] }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBHK, setSelectedBHK] = useState('');
  const [configurations, setConfigurations] = useState([]);
  const [currentConfiguration, setCurrentConfiguration] = useState({
    bhk_type: '',
    bedrooms: '',
    bathrooms: '',
    super_built_up_area: '',
    carpet_area: '',
    balconies: '',
    file: null,
    file_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK', '10BHK'];

  // Initialize configurations from props when component mounts or initialConfigurations change
  useEffect(() => {
    console.log('hritesh')
    if (initialConfigurations && initialConfigurations.length > 0) {
       console.log("Received BHK configurations from parent:", initialConfigurations);
      setConfigurations(initialConfigurations);
    }
  }, [initialConfigurations]);

  // Use useCallback to memoize event handlers
  const handleBHKSelect = useCallback((bhk) => {
    setSelectedBHK(bhk);
    setCurrentConfiguration(prev => ({
      ...prev,
      bhk_type: bhk,
      bedrooms: bhk.charAt(0)
    }));
    setShowForm(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentConfiguration(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentConfiguration(prev => ({ 
        ...prev, 
        file,
        file_name: file.name 
      }));
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setCurrentConfiguration(prev => ({ 
      ...prev, 
      file: null,
      file_name: '' 
    }));
  }, []);

  const handleEditConfiguration = useCallback((index) => {
    const configToEdit = configurations[index];
    setCurrentConfiguration(configToEdit);
    setSelectedBHK(configToEdit.bhk_type);
    setShowForm(true);
    setIsEditing(true);
    setEditIndex(index);
  }, [configurations]);

  const handleDeleteConfiguration = useCallback((index) => {
    const updatedConfigurations = [...configurations];
    updatedConfigurations.splice(index, 1);
    setConfigurations(updatedConfigurations);
    
    if (onAddConfiguration && typeof onAddConfiguration === 'function') {
      try {
        // Call onAddConfiguration but prevent any navigation side effects
        onAddConfiguration(updatedConfigurations);
      } catch (error) {
        console.error("Error in onAddConfiguration:", error);
      }
    }
  }, [configurations, onAddConfiguration]);

  const handleFormSubmit = useCallback((e) => {
    // Prevent ALL default form behaviors
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Stop further event handling
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();
      }
    }

    let updatedConfigurations;

    if (isEditing && editIndex !== null) {
      updatedConfigurations = [...configurations];
      updatedConfigurations[editIndex] = currentConfiguration;
    } else {
      updatedConfigurations = [...configurations, currentConfiguration];
    }

    // Update local state first
    setConfigurations(updatedConfigurations);

    // Reset form state
    setCurrentConfiguration({
      bhk_type: '',
      bedrooms: '',
      bathrooms: '',
      super_built_up_area: '',
      carpet_area: '',
      balconies: '',
      file: null,
      file_name: ''
    });
    setSelectedBHK('');
    setShowForm(false);
    setIsEditing(false);
    setEditIndex(null);

    // Call the callback AFTER state updates and with a small delay
    // This helps prevent the parent from redirecting before local state is updated
    if (onAddConfiguration && typeof onAddConfiguration === 'function') {
      setTimeout(() => {
        try {
          onAddConfiguration(updatedConfigurations);
        } catch (error) {
          console.error("Error in onAddConfiguration:", error);
        }
      }, 10);
    }

    return false;
  }, [configurations, currentConfiguration, editIndex, isEditing, onAddConfiguration]);

  const handleFormCancel = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setShowForm(false);
    setSelectedBHK('');
    setCurrentConfiguration({
      bhk_type: '',
      bedrooms: '',
      bathrooms: '',
      super_built_up_area: '',
      carpet_area: '',
      balconies: '',
      file: null,
      file_name: ''
    });
    setIsEditing(false);
    setEditIndex(null);
  }, []);

  const handleModalClick = useCallback((e) => {
    // Prevent clicks within the modal from propagating to elements below
    e.stopPropagation();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Configurations</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select BHK</label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  ${selectedBHK === bhk 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
          onClick={handleFormCancel} // Close when clicking the overlay
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={handleModalClick} // Prevent overlay click from closing when clicking on modal
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">{selectedBHK} Configuration</h4>
              <button 
                type="button"
                onClick={handleFormCancel} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Use div with onSubmit instead of form element to avoid native form behavior */}
            <div onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={`bedroom-${num}`} className="flex items-center">
                      <input
                        type="radio"
                        name="bedrooms"
                        value={num}
                        checked={parseInt(currentConfiguration.bedrooms) === num}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={`bathroom-${num}`} className="flex items-center">
                      <input
                        type="radio"
                        name="bathrooms"
                        value={num}
                        checked={parseInt(currentConfiguration.bathrooms) === num}
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
                  <label htmlFor="super_built_up_area" className="block text-sm font-medium text-gray-700 mb-1">
                    Super Built-up Area (sq ft)
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
                  <label htmlFor="carpet_area" className="block text-sm font-medium text-gray-700 mb-1">
                    Carpet Area (sq ft)
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <label key={`balconies-${num}`} className="flex items-center">
                      <input
                        type="radio"
                        name="balconies"
                        value={num}
                        checked={parseInt(currentConfiguration.balconies) === num}
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
                  Floorplan Upload (PDF/JPG/PNG)
                </label>
                
                {!currentConfiguration.file && !currentConfiguration.file_name ? (
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
                  type="button" // Changed from 'submit' to 'button'
                  onClick={(e) => {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  {isEditing ? 'Update Configuration' : 'Add Configuration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {configurations.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Added Configurations</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BHK Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedrooms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bathrooms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Super Built-up Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carpet Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balconies
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floorplan
                  </th> */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configurations.map((config, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.bhk_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.bedrooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.bathrooms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.super_built_up_area} sq ft
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.carpet_area} sq ft
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.balconies}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.file_name || 'No file'}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditConfiguration(index);
                          }} 
                          className="text-blue-600 hover:text-blue-800"
                          type="button"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteConfiguration(index);
                          }} 
                          className="text-red-600 hover:text-red-800"
                          type="button"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyConfiguration;