"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <h1>Error: {error.message}</h1>
      </body>
    </html>
  );
}