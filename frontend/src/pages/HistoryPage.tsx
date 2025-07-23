type HistoryPageProps = {
  history: string[];
};

export default function HistoryPage({ history }: HistoryPageProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Historial de Capturas</h1>
      {history.length === 0 ? (
        <p className="text-gray-600">No has capturado ninguna imagen aún.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {history.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`captura-${i}`}
              className="border rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
