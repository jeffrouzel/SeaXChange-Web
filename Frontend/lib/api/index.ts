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
    
    // const missingFields = requiredFields.filter(field => !response.data[field]);
    // if (missingFields.length > 0) {
    //   throw new Error(`Invalid asset data: Missing required fields: ${missingFields.join(', ')}`);
    // }

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
// export const createAsset = async (assetData: any) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/createAsset`, assetData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating asset:", error);
//     throw error;
//   }
// };
// lib/api.ts

export const createAsset = async (assetData: any) => {
  try {
    // const response = await fetch("API_BASE_URL/createAsset", 
    const response = await fetch(`${API_BASE_URL}/createAsset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create asset");
    }

    return data;
  } catch (error) {
    console.error("API Error in createAsset:", error);
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
export const transferAsset = async (assetData: {
  id: string;
  role: string;
  newParticipant: string;
  newLocation: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transferAsset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to transfer asset");
    }

    return data;
  } catch (error) {
    console.error("API Error in transferAsset:", error);
    throw error;
  }
};

// Add this function to your api.ts
export const getHighestTunaId = async (): Promise<number> => {
  try {
    const assets = await fetchAssets();
    const tunaIds = assets
      .filter((asset: any) => asset.ID.startsWith('tuna'))
      .map((asset: any) => {
        const num = parseInt(asset.ID.replace('tuna', ''));
        return isNaN(num) ? 0 : num;
      });
    
    return tunaIds.length > 0 ? Math.max(...tunaIds) : 0;
  } catch (error) {
    console.error('Error getting highest tuna ID:', error);
    return 0;
  }
};
