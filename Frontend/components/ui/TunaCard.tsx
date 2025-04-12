interface TunaCardProps {
  id: string;
  date: string;
  species: string;
  location: string;
  // weight: number;
}

export default function TunaCard({ id, date, species, location }: TunaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center transition-all cursor-pointer">
      <div className="h-40 bg-gray-300 flex items-center justify-center">Picture</div>
      <h3 className="text-xl font-bold mb-2 text-[#429FAD]">{id}</h3>
      <div className="space-y-2 text-gray-600">
        <p><span className="font-semibold">Species:</span> {species}</p>
        <p><span className="font-semibold">Catch Location:</span> {location}</p>
        <p><span className="font-semibold">Catch Date:</span> {date}</p>
        <div className="mt-4">
          {/* <span className="inline-block bg-[#429FAD] text-white text-sm px-3 py-1 rounded-full">
            {weight} kg
          </span> */}
        </div>
      </div>
    </div>
  );
}
