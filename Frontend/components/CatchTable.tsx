import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type AssetDetail = {
  label: string;
  value: string;
};

type CatchDetailsTableProps = {
  assetDetails: AssetDetail[];
  editableFields?: string[];
};

export default function CatchDetailsTable({
  assetDetails,
  editableFields = [],
}: CatchDetailsTableProps) {
  return (
    <div className="bg-white shadow-lg">
      {assetDetails.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b last:border-b-0 px-4 py-3"
        >
          <span className="font-medium">{item.label}</span>
          <div className="flex items-center gap-2">
            <span>{item.value}</span>
            {editableFields.includes(item.label) && (
              <Button variant={"ghost"} size="icon">
                <Pencil
                  className="w-4 h-4 text-black-500 cursor-pointer"
                  strokeWidth={3}
                />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
