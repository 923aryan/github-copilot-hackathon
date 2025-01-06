import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onChange(files);
  };

  return (
    <div>
      <Button onClick={handleClick} variant="neutral" type='button'>
        Upload File
      </Button>
      <input
        type="file"
        multiple
        ref={inputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUpload;