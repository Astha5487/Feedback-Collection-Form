import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Form } from '../services/formService';
import FormPreview from './FormPreview';

interface FormPreviewButtonProps {
  form: Form;
  className?: string;
}

const FormPreviewButton: React.FC<FormPreviewButtonProps> = ({ form, className = 'btn btn-secondary' }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className={className}
      >
        <EyeIcon className="h-5 w-5 mr-2" />
        Preview Form
      </button>
      
      {isPreviewOpen && (
        <FormPreview 
          form={form} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </>
  );
};

export default FormPreviewButton;