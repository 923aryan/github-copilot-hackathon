import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FormMessage } from '../ui/form';

const MemoryEditor: React.FC<{
  title: React.InputHTMLAttributes<HTMLInputElement>;
  description: React.InputHTMLAttributes<HTMLTextAreaElement>;
  tags: React.InputHTMLAttributes<HTMLInputElement>;
  errors: any; // Assuming form errors are passed
}> = ({ title, description, tags, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Title</label>
        <Input {...title} placeholder="Title of the memory" />
        {/* Display title error */}
        {errors.title && <FormMessage>{errors.title.message}</FormMessage>}
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <Textarea {...description} placeholder="Describe the memory..." />
        {/* Display description error */}
        {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Tags</label>
        <Input
          {...tags}
          placeholder="Enter tags separated by commas"
        />
        {/* Display tags error */}
        {errors.tags && <FormMessage>{errors.tags.message}</FormMessage>}
      </div>
    </div>
  );
};

export default MemoryEditor;
