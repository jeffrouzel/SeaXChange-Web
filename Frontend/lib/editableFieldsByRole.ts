export const editableFieldsByRole: Record<string, string[]> = {
    fisher: [
      "ID",
      "Species",
      "Catch Location",
      "Catch Date",
      "Fishing Method",
      "Fisher",
    ],
    supplier: [
      "Supplier",
    ],
    retailer: [
      "Retailer",
    ],
    consumer: [
      "Consumer",
    ],
  };
  
  export const getEditableFieldsForRole = (role: string): string[] => {
    return editableFieldsByRole[role] || [];
  };
  