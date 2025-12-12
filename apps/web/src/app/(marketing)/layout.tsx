import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]"> {/* Adjust height for Navbar */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}