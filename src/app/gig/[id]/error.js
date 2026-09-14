'use client';
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-red-500">
      <h2 className="text-2xl font-bold mb-4">Something went wrong in the Gig Page!</h2>
      <p className="mb-4 bg-red-50 p-4 rounded text-left text-sm whitespace-pre-wrap">{error?.message || "Unknown error"}</p>
      <p className="mb-4 bg-gray-50 p-4 rounded text-left text-xs text-gray-500 whitespace-pre-wrap">{error?.stack || ""}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-red-500 text-white rounded">Try again</button>
    </div>
  );
}
