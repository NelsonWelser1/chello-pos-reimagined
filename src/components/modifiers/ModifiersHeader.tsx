
import { Settings } from "lucide-react";

export default function ModifiersHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
          <Settings className="w-10 h-10 text-white" />
        </div>
        Modifier Management
      </h1>
      <p className="text-xl text-slate-600 mt-4 font-medium">Manage menu item modifiers and customizations</p>
    </div>
  );
}
