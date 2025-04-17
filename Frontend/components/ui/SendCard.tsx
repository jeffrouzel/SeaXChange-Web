import React, {useState} from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from "lucide-react";
import { transferAsset } from "@/lib/api";
import { useParams } from 'next/navigation';


interface SendCardProps {
    onClose: () => void;
}

const SendCard: React.FC<SendCardProps> = ({ onClose }) => {
    // State hooks for input values
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [location, setLocation] = useState("");

    // Simulated session role (replace with actual session hook later)
    const userRole = "Fisher"; // simulate for now
    const params = useParams();
    const assetId = params?.id as string;


    // Handle send button click
    const handleSend = async () => {
        if (userRole === "Fisher") {
            const newParticipant = `${userId}:${name}`;


            console.log("Sending:", { assetId, userId, name, location, newParticipant });

            try {
                const result = await transferAsset({
                    id: assetId,
                    role: "Supplier",
                    newParticipant: `${userId}:${name}`,
                    newLocation: location,
                });

                // const result = await response.json();
                // if (response.ok) {
                //     alert(`✅ Asset transferred successfully.\nOld Owner: ${result.oldOwner}`);
                //     onClose(); // close modal
                // } else {
                //     alert(`❌ Transfer failed: ${result.error}`);
                // }
                alert(`✅ Asset transferred successfully to ${newParticipant} at ${location}.`);
                onClose(); // close modal
            } catch (error) {
                alert(`❌ Error: ${error}`);
            }
        } else {
            alert("❌ Unauthorized: Only Fisher can transfer asset.");
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