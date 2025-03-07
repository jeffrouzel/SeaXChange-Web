interface TunaCardProps {
    id: string;
    date: string;
    status: string;
  }
  
  const TunaCard: React.FC<TunaCardProps> = ({ id, date, status }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <div className="h-40 bg-gray-300 flex items-center justify-center">Picture</div>
        <h2 className="font-bold mt-2">{id}</h2>
        <p className="text-gray-600">{date}</p>
        <p className={`font-semibold ${status === "Sold" ? "text-red-500" : "text-green-600"}`}>
          {status}
        </p>
      </div>
    );
  };
  
  export default TunaCard;
  