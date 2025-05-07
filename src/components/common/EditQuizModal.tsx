import React, { useState } from 'react';
import Modal from './Modal';

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle: string;
  initialDescription: string;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialDescription,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, description);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative z-50 bg-dark-green text-white p-6 rounded-lg w-[500px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl mb-6">Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-green border border-gray-400 rounded-md text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-dark-green border border-gray-400 rounded-md text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter quiz description"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-cream hover:bg-opacity-90 text-dark-green rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditQuizModal; 