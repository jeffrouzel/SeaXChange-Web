"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";

type AssetDetail = {
  label: string;
  value: string;
};

type CatchDetailsTableProps = {
  assetDetails: AssetDetail[];
  editableFields?: string[];
  onChange?: (updates: Record<string, string>) => void;
};

export default function CatchDetailsTable({
  assetDetails,
  editableFields = [],
  onChange
}: CatchDetailsTableProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>(
    Object.fromEntries(assetDetails.map((item) => [item.label, item.value]))
  );

  const handleEditClick = (label: string) => {
    if (!editableFields.includes(label)) return;
    setEditingField(label);
  };

  const handleInputChange = (label: string, newValue: string) => {
    if (label === "Weight (kg)" && !/^\d*\.?\d*$/.test(newValue)) return;
    if (
      ["Species", "Catch Location", "Fishing Method"].includes(label) &&
      /[^a-zA-Z\s]/.test(newValue)
    )
      return;
    
    setEditedValues((prev) => ({ ...prev, [label]: newValue }));
    
    // Map the label back to the asset property name
    const propertyMap: { [key: string]: string } = {
      "ID": "ID",
      "Species": "Species",
      "Catch Location": "CatchLocation",
      "Catch Date": "CatchDate",
      "Fishing Method": "FishingMethod",
      "Fisher": "Fisher"
    };

    // Notify parent component of changes
    if (onChange && propertyMap[label]) {
      onChange({ [propertyMap[label]]: newValue });
    }
  };

  const handleSave = () => {
    setEditingField(null);
  };

  return (
    <div className="bg-white shadow-lg">
      {assetDetails.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b last:border-b-0 px-4 py-3"
        >
          <span className="font-medium">{item.label}</span>
          <div className="flex items-center gap-2">
            {editingField === item.label ? (
              item.label === "Catch Date" ? (
                <input
                  type="date"
                  value={editedValues[item.label]}
                  onChange={(e) => handleInputChange(item.label, e.target.value)}
                  onBlur={handleSave}
                  className="border p-1 rounded"
                />
              ) : (
                <input
                  type="text"
                  value={editedValues[item.label]}
                  onChange={(e) => handleInputChange(item.label, e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                  className="border p-1 rounded"
                />
              )
            ) : (
              <span>{editedValues[item.label]}</span>
            )}

            {editableFields.includes(item.label) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  editingField === item.label
                    ? handleSave()
                    : handleEditClick(item.label)
                }
              >
                {editingField === item.label ? (
                  <Check className="w-4 h-4 text-green-500" strokeWidth={3} />
                ) : (
                  <Pencil className="w-4 h-4 text-black-500" strokeWidth={3} />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
