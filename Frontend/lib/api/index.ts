import axios from 'axios';

// The base URL of server running on GCP VM
const API_BASE_URL = 'http://35.238.113.73:5000';

// Fetch all assets
export const fetchAssets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assets`);
    return response.data;  // This is the JSON data returned from the API
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

// Create a new asset
export const createAsset = async (assetData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createAsset`, assetData);
    return response.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

// Update an asset
export const updateAsset = async (assetData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateAsset`, assetData);
    return response.data;
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

// Transfer an asset
export const transferAsset = async (assetData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transferAsset`, assetData);
    return response.data;
  } catch (error) {
    console.error("Error transferring asset:", error);
    throw error;
  }
};
