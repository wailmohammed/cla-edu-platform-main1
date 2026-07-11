import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileIcon, Download, Trash2, Upload, Code } from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
  content?: string;
}

interface FileShareChatProps {
  groupId: string;
  onFileShare: (file: SharedFile) => void;
  sharedFiles: SharedFile[];
}

export default function FileShareChat({
  groupId,
  onFileShare,
  sharedFiles,
}: FileShareChatProps) {
  const [files, setFiles] = useState<SharedFile[]>(sharedFiles);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        setIsUploading(true);

        // Simulate file upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile: SharedFile = {
            id: `file-${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedBy: "Current User",
            uploadedAt: new Date(),
            url: URL.createObjectURL(file),
            content: e.target?.result as string,
          };

          setFiles([...files, newFile]);
          onFileShare(newFile);
          setUploadProgress(0);
          setIsUploading(false);
        };

        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(progress);
          }
        };

        reader.readAsText(file);
      });
    },
    [files, onFileShare]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt", ".md"],
      "text/javascript": [".js", ".jsx"],
      "text/typescript": [".ts", ".tsx"],
      "text/x-python": [".py"],
      "text/x-java": [".java"],
      "text/x-c": [".c", ".cpp", ".h"],
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type.includes("javascript")) return "📜";
    if (type.includes("python")) return "🐍";
    if (type.includes("json")) return "{}";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-blue-600 bg-blue-100"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-600" />
        {isDragActive ? (
          <p className="text-blue-600 font-semibold">Drop files here...</p>
        ) : (
          <>
            <p className="text-gray-800 font-semibold">
              Drag & drop files here, or click to select
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Supported: Code, documents, images (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Shared Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Shared Files ({files.length})
          </h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getFileIcon(file.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-600">
                        {file.uploadedBy}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-600">
                        {file.uploadedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {file.type.includes("text") ||
                  file.type.includes("javascript") ||
                  file.type.includes("python") ||
                  file.type.includes("json") ? (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Code className="w-3 h-3 mr-1" />
                      Code
                    </Badge>
                  ) : null}
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-500">
          <FileIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No files shared yet. Upload code snippets or study materials!</p>
        </div>
      )}

      {/* File Preview Section */}
      {files.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Preview</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {files
              .filter(
                (f) =>
                  f.type.includes("text") ||
                  f.type.includes("javascript") ||
                  f.type.includes("python") ||
                  f.type.includes("json")
              )
              .slice(0, 3)
              .map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto"
                >
                  <p className="text-gray-500 mb-2">{file.name}</p>
                  <pre className="whitespace-pre-wrap break-words">
                    {file.content?.slice(0, 200)}
                    {file.content && file.content.length > 200 ? "..." : ""}
                  </pre>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}
