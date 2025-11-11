"use client";
export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700">
      <strong className="font-semibold">Error: </strong>
      <span className="ml-1">{message}</span>
    </div>
  );
}
