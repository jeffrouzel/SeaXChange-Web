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

// Fetch asset details by ID
export interface AssetDetails {
  ID: string;
  Species: string;
  Weight: number;
  CatchLocation: string;
  CatchDate: string;
  FishingMethod: string;
  Fisher: string;
  Supplier: string;
  SellingLocationSupplier: string;
  Retailers: string[];
  SellingLocationRetailers: string[];
  Consumers: string[];
}

export const fetchAssetById = async (id: string): Promise<AssetDetails> => {
  try {
    console.log(`Making request to: ${API_BASE_URL}/asset/${id}`);
    const response = await axios.get(`${API_BASE_URL}/asset/${id}`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 500) {
      throw new Error(`Server error: The asset "${id}" could not be retrieved. Please verify the asset ID and try again.`);
    }

    if (!response.data) {
      throw new Error(`No data received for asset "${id}"`);
    }

    // Update validation to match actual API response fields
    const requiredFields = [
      'ID', 
      'Species', 
      'Weight', 
      'CatchLocation', 
      'CatchDate', 
      'FishingMethod', 
      'Fisher'
    ];
    
    const missingFields = requiredFields.filter(field => !response.data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Invalid asset data: Missing required fields: ${missingFields.join(', ')}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage
      });
      throw new Error(`API Error: ${errorMessage}`);
    }
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
