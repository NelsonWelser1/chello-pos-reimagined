
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";

export function ImportSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !dataType) {
      toast.error("Please select a file and data type");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          toast.success(`Successfully imported ${selectedFile.name}`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    console.log("Importing file:", selectedFile.name, "as", dataType);
  };

  const dataTypes = [
    { value: "menu-items", label: "Menu Items" },
    { value: "categories", label: "Categories" },
    { value: "ingredients", label: "Ingredients" },
    { value: "suppliers", label: "Suppliers" },
    { value: "customers", label: "Customers" },
    { value: "sales", label: "Sales Data" },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Import Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Data Type
            </label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose data type to import" />
              </SelectTrigger>
              <SelectContent>
                {dataTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CSV, JSON, Excel files (Max 10MB)
                </p>
              </label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {selectedFile && (
            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700">
                Ready to import: {selectedFile.name}
              </span>
            </div>
          )}
        </div>

        <Button 
          onClick={handleImport} 
          disabled={!selectedFile || !dataType || isUploading}
          className="w-full"
        >
          {isUploading ? "Importing..." : "Import Data"}
        </Button>

        <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-700">
            <p className="font-medium">Important:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Ensure your data format matches our templates</li>
              <li>Duplicate entries will be updated</li>
              <li>Invalid data will be skipped</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
