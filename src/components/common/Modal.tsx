import React from 'react';
import { componentStyles } from '../../config/theme';

// Define the props interface for the Modal component
interface ModalProps {
  isOpen: boolean;        // Controls visibility of the modal
  onClose: () => void;    // Function to call when closing the modal
  children: React.ReactNode; // Content to be rendered inside the modal
  title?: string;         // Optional title for the modal
  footer?: React.ReactNode; // Optional footer content
  className?: string;     // Additional CSS classes for customization
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  footer,
  className = ''  // Default to empty string if not provided
}: ModalProps) {
  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay: Covers the entire screen behind the modal */}
      <div 
        className={componentStyles.modal.overlay}
        onClick={onClose}  // Close modal when clicking outside
      />

      {/* Modal container */}
      <div className={componentStyles.modal.container}>
        {/* Modal content with additional custom classes */}
        <div className={`${componentStyles.modal.content} ${className}`}>
          {/* Header: Rendered only if title is provided */}
          {title && (
            <div className={componentStyles.modal.header}>
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            </div>
          )}

          {/* Body: Contains the main content (children) of the modal */}
          <div className={componentStyles.modal.body}>
            {children}
          </div>

          {/* Footer: Rendered only if footer content is provided */}
          {footer && (
            <div className={componentStyles.modal.footer}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
