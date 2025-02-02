import React from 'react';
import { componentStyles } from '../../config/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  footer,
  className = ''
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={componentStyles.modal.overlay}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={componentStyles.modal.container}>
        <div className={`${componentStyles.modal.content} ${className}`}>
          {/* Header */}
          {title && (
            <div className={componentStyles.modal.header}>
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            </div>
          )}

          {/* Body */}
          <div className={componentStyles.modal.body}>
            {children}
          </div>

          {/* Footer */}
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