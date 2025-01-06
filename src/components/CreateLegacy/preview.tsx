import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from 'react-router-dom';

type FileOrBlob = File | Blob;
type FileWithUrl = {
  url: string;
  type: string;
  name: string;
};

interface PreviewProps {
  files: (FileOrBlob | FileWithUrl)[];
  memoryData: {
    title: string;
    description: string;
    tags: string[] | string;
  };
}


export const PreviewWrapper = () => {
  const location = useLocation();
  const { files, memoryData } = location.state || { files: [], memoryData: null };

  return <Preview files={files} memoryData={memoryData} />;
};


const Preview: React.FC<PreviewProps> = ({ files, memoryData }) => {
  console.log("files data is ", files, "memory data  is ", memoryData)
  if ((!files || files.length === 0) && !memoryData.title && !memoryData.tags && !memoryData.description) return null;

  let tagsArray: string[];
  if (Array.isArray(memoryData.tags)) {
    tagsArray = memoryData.tags;
  } else if (typeof memoryData.tags === 'string') {
    tagsArray = memoryData.tags.split(',').map(tag => tag.trim());
  } else {
    tagsArray = []; // or handle as needed if tags could be undefined or null
  }

  console.log("tags is ", tagsArray);
  console.log("content is ", memoryData, files)
  return (
    <Card className="w-full max-w-4xl min-sm:mx-auto transition-transform duration-500 ease-in-out flex flex-col max-h-full">
      {/* Header */}
      {memoryData.title && (
        <CardHeader>
          <CardTitle className="p-2 border-[0.15rem] border-dashed border-black rounded-base">
            {memoryData.title}
          </CardTitle>
        </CardHeader>
      )}

      {/* Scrollable Content */}
      <CardContent className="flex-grow overflow-auto scrollbar-hide min-h-0 mt-2">
        <div className="space-y-4 flex flex-col items-center justify-center">
          {files.map((file, index) => {
            // Check if the file is a File or Blob
            const src =
              file instanceof File || file instanceof Blob
                ? URL.createObjectURL(file)
                : file.url;

            const fileName = "name" in file ? file.name : `File-${index}`; // Fallback for Blobs without a name

            const fileType = "type" in file ? file.type.split('/')[0] : "unknown";
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            let content = null;

            switch (fileType) {
              case 'image':
                content = (
                  <img
                    style={{ border: "1px dashed white", borderRadius: "8px" }}
                    src={src}
                    alt={`${memoryData.title} - ${fileName}`}
                    className="max-w-full h-auto"
                  />
                );
                break;
              case 'video':
                content = (
                  <video controls className="max-w-full h-auto">
                    <source src={src} type={fileType} />
                    Your browser does not support the video tag.
                  </video>
                );
                break;
              case 'audio':
                content = (
                  <audio controls className="w-full">
                    <source src={src} type={fileType} />
                    Your browser does not support the audio element.
                  </audio>
                );
                break;
              default:
                content = fileExtension === 'pdf' ? (
                  <div className="text-center">PDF Document: {fileName}</div>
                ) : (
                  <div className="text-center">{fileName}</div>
                );
            }

            return <div key={index}>{content}</div>;
          })}

        </div>
      </CardContent>

      {/* Fixed Footer */}
      <CardContent className="mt-auto bg-card">
        <div className="space-y-2 mt-2">
          {memoryData.description && (
            <p className="text-sm">{memoryData.description}</p>
          )}
          <p className="text-sm font-base">
            {tagsArray.length > 0 && tagsArray[0] ? `Tags: ${tagsArray.map(tag => `#${tag}`).join(' ')}` : 'No tags added'}
          </p>

        </div>
      </CardContent>
    </Card>
  );


};

export default Preview;