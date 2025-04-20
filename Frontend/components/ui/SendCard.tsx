import React, {useEffect, useState} from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from "lucide-react";
import { transferAsset } from "@/lib/api";
import { useParams } from 'next/navigation';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";


interface SendCardProps {
    onClose: () => void;
}

const SendCard: React.FC<SendCardProps> = ({ onClose }) => {
    // State hooks for input values
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [location, setLocation] = useState("");
    // const [nextRole, setNextRole] = useState("");
    const [userRole, setUserRole] = useState("");

    // Simulated session role (replace with actual session hook later)
    // const userRole = "Fisher"; // simulate for now
    const params = useParams();
    const assetId = params?.id as string;
    
    useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
    
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              const formattedRole = data.userType.charAt(0).toUpperCase() + data.userType.slice(1);
              setUserRole(formattedRole); // set from Firestore
              setName(data.name);         // prefill name if needed
              setUserId(data.customId || user.uid); // prefill ID
              console.log("Fetched user role:", formattedRole);
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        };
    
        fetchUserRole();
      }, []);

    const getAvailableRoles = () => {
        if (userRole === "Fisher") return ["Supplier"];
        if (userRole === "Supplier") return ["Retailer"];
        if (userRole === "Retailer") return ["Retailer"];
        return [];
    };

    const getNextRole = () => {
        if (userRole === "Fisher") return "Supplier";
        if (userRole === "Supplier") return "Retailer";
        if (userRole === "Retailer") return "Retailer";
        return "";
    };

    const nextRole = getNextRole();

    


    // Handle send button click
    const handleSend = async () => {
        // if (!getAvailableRoles().includes(nextRole)) {
        //     return alert(`❌ Invalid role transition.`);
        // }

        const newParticipant = `${userId}:${name}`;

        console.log("Sending:", { assetId, userId, name, location, newParticipant, nextRole });

        try {
            const result = await transferAsset({
                id: assetId,
                role: nextRole,
                newParticipant,
                newLocation: location,
            });

            alert(`✅ Asset transferred to ${nextRole} (${newParticipant}) at ${location}.`);
            onClose(); // Close modal
        } catch (error) {
            alert(`❌ Error: ${error}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Send Tuna</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition duration-300" />
                    </button>
                </div>

                 {/* Name Input */}
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>

                {/* ID Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <Input
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                    />
                </div>

                {/* Location Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                {/* Send Button */}
                <div className="flex justify-center">
                    <Button className="w-full" onClick={handleSend}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SendCard;