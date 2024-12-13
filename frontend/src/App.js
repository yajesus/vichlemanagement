import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { format } from "date-fns";

const API_URL = "https://backendtest-242n.onrender.com/api/vehicles";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [vehicleStatuses, setVehicleStatuses] = useState({});
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true); // Start loading when fetching
    try {
      const response = await axios.get(API_URL);
      setVehicles(response.data);

      const statuses = response.data.reduce((acc, vehicle) => {
        acc[vehicle._id] = vehicle.status;
        return acc;
      }, {});
      setVehicleStatuses(statuses);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "vehicleName") {
      setVehicleName(e.target.value);
    } else {
      setVehicleStatus(e.target.value);
    }
  };

  const handleStatusChange = (vehicleId, event) => {
    const newStatus = event.target.value;
    setVehicleStatuses((prevStatuses) => ({
      ...prevStatuses,
      [vehicleId]: newStatus,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vehicleName && vehicleStatus) {
      try {
        await axios.post(API_URL, { name: vehicleName, status: vehicleStatus });
        fetchVehicles();
        setShowForm(false);
        setVehicleName("");
        setVehicleStatus("");
      } catch (error) {
        console.error("Error adding vehicle:", error);
      }
    }
  };

  const updateStatus = async (id) => {
    const newStatus = vehicleStatuses[id];
    if (newStatus) {
      try {
        await axios.put(`${API_URL}/${id}`, { status: newStatus });
        fetchVehicles();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Vehicle Management Dashboard</h1>
      <button className="add-vehicle-btn" onClick={handleAddButtonClick}>
        Add Vehicle
      </button>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="vehicle-form">
            <h2>Add a New Vehicle</h2>
            <label htmlFor="vehicleName">Vehicle Name</label>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              value={vehicleName}
              onChange={handleInputChange}
              placeholder="Enter vehicle name"
              required
              className="addvehicleinput"
            />
            <label htmlFor="vehicleStatus">Vehicle Status</label>
            <input
              type="text"
              id="vehicleStatus"
              name="vehicleStatus"
              value={vehicleStatus}
              onChange={handleInputChange}
              placeholder="Enter vehicle status"
              required
              className="addvehicleinput"
            />
            <button type="submit" className="submit-btn">
              Add Vehicle
            </button>
          </form>
        </div>
      )}

      {/* Conditional rendering of the loading spinner */}
      {loading && <div className="loading-spinner"></div>}

      <div className="vehicle-table">
        <table>
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.name}</td>
                <td>{vehicle.status}</td>
                <td>{format(new Date(vehicle.lastUpdated), "yyyy-MM-dd")}</td>
                <td>
                  <input
                    type="text"
                    value={vehicleStatuses[vehicle._id] || ""}
                    onChange={(e) => handleStatusChange(vehicle._id, e)}
                    placeholder="New status"
                  />
                  <button onClick={() => updateStatus(vehicle._id)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
