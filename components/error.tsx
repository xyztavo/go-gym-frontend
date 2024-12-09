export default function ErrorDiv({ error, statusCode }: { error: string, statusCode: number }) {
  return (
    <div className="flex flex-col items-center justify-center my-4 gap-2">
      <h1 className="text-2xl font-bold text-red-500">Error {statusCode}!</h1>
      <div className="flex flex-row items-center justify-center border border-muted rounded-md p-2">
        Reason: {error}
      </div>
    </div>
  );
}
