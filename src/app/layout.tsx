import "./globals.css";

export const metadata = {
  title: "Project Management",
  description: "Manage projects, tasks, calls and chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}