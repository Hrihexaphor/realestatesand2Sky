import React, { useState } from 'react';
import './PropertyConfiguration.css'; // You can create this CSS file for styling

const PropertyConfiguration = ({ onAddConfiguration }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBHK, setSelectedBHK] = useState('');
  const [configurations, setConfigurations] = useState([]);
  const [currentConfiguration, setCurrentConfiguration] = useState({
    bhk_type: '',
    bedrooms: '',
    bathrooms: '',
    super_built_up_area: '',
    carpet_area: '',
    balconies: ''
  });
  const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK'];

  const handleBHKSelect = (bhk) => {
    setSelectedBHK(bhk);
    setCurrentConfiguration({
      ...currentConfiguration,
      bhk_type: bhk,
      bedrooms: bhk.charAt(0) // Automatically set bedrooms based on BHK type
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentConfiguration(prev => ({ ...prev, [name]: value }));
  };

  const handleEditConfiguration = (index) => {
  const configToEdit = configurations[index];
  setCurrentConfiguration(configToEdit);
  setSelectedBHK(configToEdit.bhk_type); // This sets selected BHK
  setShowForm(true);
  setIsEditing(true);
  setEditIndex(index);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  e.stopPropagation();

  let updatedConfigurations;

  if (isEditing && editIndex !== null) {
    updatedConfigurations = [...configurations];
    updatedConfigurations[editIndex] = currentConfiguration;
  } else {
    updatedConfigurations = [...configurations, currentConfiguration];
  }

  setConfigurations(updatedConfigurations);

  if (onAddConfiguration) {
    onAddConfiguration(updatedConfigurations);
  }

  // Reset form
  setCurrentConfiguration({
    bhk_type: '',
    bedrooms: '',
    bathrooms: '',
    super_built_up_area: '',
    carpet_area: '',
    balconies: ''
  });
  setSelectedBHK('');
  setShowForm(false);
  setIsEditing(false);
  setEditIndex(null);
};


  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedBHK('');
    setCurrentConfiguration({
      bhk_type: '',
      bedrooms: '',
      bathrooms: '',
      super_built_up_area: '',
    
      carpet_area: '',
      balconies: ''
    });
  };

  return (
    <div className="property-configuration-container">
      <div className="bhk-selection">
        <h3>Property Configurations</h3>
        <div className="form-row">
          <label>Select BHK</label>
          <div className="bhk-options">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                className={`bhk-option ${selectedBHK === bhk ? 'selected' : ''}`}
                onClick={() => handleBHKSelect(bhk)}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="configuration-form-modal">
          <div className="configuration-form-content">
            <h4>{selectedBHK} Configuration</h4>
            <form onSubmit={handleFormSubmit}>
           <div className="form-row">
                    <label>Bedrooms</label>
                    <div className="radio-group">
                        {[1, 2, 3, 4, 5].map((num) => (
                        <label key={`bedroom-${num}`}>
                            <input
                            type="radio"
                            name="bedrooms"
                            value={num}
                            checked={parseInt(currentConfiguration.bedrooms) === num}
                            onChange={handleInputChange}
                            required
                            />
                            {num}
                        </label>
                        ))}
                    </div>
                    </div>


                <div className="form-row">
                <label>Bathrooms</label>
                <div className="radio-group">
                    {[1, 2, 3, 4, 5].map((num) => (
                    <label key={`bathroom-${num}`}>
                        <input
                        type="radio"
                        name="bathrooms"
                        value={num}
                        checked={parseInt(currentConfiguration.bathrooms) === num}
                        onChange={handleInputChange}
                        required
                        />
                        {num}
                    </label>
                    ))}
                </div>
                </div>


              <div className="form-row">
                <label htmlFor="super_built_up_area">Super Built-up Area (sq ft)</label>
                <input
                  type="number"
                  id="super_built_up_area"
                  name="super_built_up_area"
                  value={currentConfiguration.super_built_up_area}
                  onChange={handleInputChange}
                  required
                />
              </div>

             

              <div className="form-row">
                <label htmlFor="carpet_area">Carpet Area (sq ft)</label>
                <input
                  type="number"
                  id="carpet_area"
                  name="carpet_area"
                  value={currentConfiguration.carpet_area}
                  onChange={handleInputChange}
                  required
                />
              </div>

             <div className="form-row">
                <label>Balconies</label>
                <div className="radio-group">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                    <label key={`balconies-${num}`}>
                        <input
                        type="radio"
                        name="balconies"
                        value={num}
                        checked={parseInt(currentConfiguration.balconies) === num}
                        onChange={handleInputChange}
                        required
                        />
                        {num}
                    </label>
                    ))}
                </div>
                </div>


              {/* <div className="form-row">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={currentConfiguration.price}
                  onChange={handleInputChange}
                  required
                />
              </div> */}

              <div className="form-actions">
                <button type="button" onClick={handleFormCancel} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="add-btn" onClick={handleFormSubmit}>
                  Add Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {configurations.length > 0 && (
        <div className="added-configurations">
          <h4>Added Configurations</h4>
          <table className="configurations-table">
            <thead>
              <tr>
                <th>BHK Type</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Super Built-up Area</th>
                <th>Carpet Area</th>
                <th>Balconies</th>
                <th>Actions</th>
                {/* <th>Price</th> */}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => (
                <tr key={index}>
                  <td>{config.bhk_type}</td>
                  <td>{config.bedrooms}</td>
                  <td>{config.bathrooms}</td>
                  <td>{config.super_built_up_area} sq ft</td>
                  <td>{config.carpet_area} sq ft</td>
                  <td>{config.balconies}</td>
                  <td>
                    <button onClick={() => handleEditConfiguration(index)} className="edit-btn">Edit</button>
                    </td>
                  {/* <td>₹{config.price}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyConfiguration;