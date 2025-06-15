
import POSHeader from "@/components/pos/POSHeader";
import POSContainer from "@/components/pos/POSContainer";

export default function POS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <POSHeader />
      <POSContainer />
    </div>
  );
}
