import React from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from "lucide-react";

interface SendCardProps {
    onClose: () => void;
}

const SendCard: React.FC<SendCardProps> = ({ onClose }) => {
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
                    <Input/>
                </div>

                {/* ID Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <Input/>
                </div>

                {/* Send Button */}
                <div className="flex justify-center">
                    <Button className="w-full">Send</Button>
                </div>
            </div>
        </div>
    )
}

export default SendCard;