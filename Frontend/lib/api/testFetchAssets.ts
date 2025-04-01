// filepath: c:\SpecialProblem\hyperledger-fabric3\SeaXChange-Web\Frontend\lib\api\testFetchAssets.ts
import { fetchAssets } from './index';

const testFetchAssets = async () => {
    try {
        console.log("Fetching assets...");
        const assets = await fetchAssets();
        console.log("Assets fetched successfully:", assets);
    } catch (error) {
        console.error("Error fetching assets:", error);
    }
};

testFetchAssets();