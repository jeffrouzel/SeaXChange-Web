import Image from 'next/image';

interface TunaCardProps {
  id: string;
  date: string;
  species: string;
  location: string;
}

const getSpeciesImage = (species: string): string => {
  // Get first word and convert to lowercase
  const baseSpecies = species.split(' ')[0].toLowerCase();
  
  // Map of known species to their image paths
  const speciesImages: { [key: string]: string } = {
    'skipjack': '/tunaImage/Turingan.jpg',
    'yellowfin': '/tunaImage/Tambakol.jpg',
    'bullet': '/tunaImage/Kurit.JPG',
    'albacore': '/tunaImage/Bariles.jpg',
    'turingan': '/tunaImage/Turingan.jpg',
    'tulingan': '/tunaImage/Turingan.jpg',
    'tambakol': '/tunaImage/Tambakol.jpg',
    'kurit': '/tunaImage/Kurit.JPG',
    'bariles': '/tunaImage/Bariles.jpg'
  };

  // Return the species image path or the default image if species not found
  return speciesImages[baseSpecies] || `/tunaImage/${baseSpecies}.jpg`;
};

export default function TunaCard({ id, date, species, location }: TunaCardProps) {
  return (
    <div className="bg-white hover:border-[#87CEFA] border-2 border-transparent rounded-lg shadow-md p-6 hover:shadow-xl transform transition-all duration-350 ease-in-out hover:-translate-y-1 cursor-pointer">
      <div className="h-60 relative overflow-hidden rounded-md group">
        <Image
          src={getSpeciesImage(species)}
          alt={`${species} tuna`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = species;
          }}
        />
        <div className="absolute inset-0 bg-[#429FAD]/20 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#429FAD] text-center">{id}</h3>
      <div className="space-y-2 text-gray-600 text-center">
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
