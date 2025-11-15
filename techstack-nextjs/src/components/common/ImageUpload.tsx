import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Avatar,
  Typography,
  Alert,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (imageUrl: string, publicId: string) => void;
  onImageRemoved?: () => void;
  type: 'blog' | 'testimonial';
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUploaded,
  onImageRemoved,
  type,
  maxSize = 5, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('filename', `${Date.now()}-${file.name}`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageUploaded(data.data.url, data.data.publicId);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          border: `2px dashed ${dragOver ? '#667eea' : '#ddd'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: dragOver ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!uploading ? handleButtonClick : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedFormats.join(',')}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {currentImage ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={currentImage}
              sx={{ width: 120, height: 120 }}
              variant="rounded"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick();
                }}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                size="small"
              >
                {uploading ? 'Uploading...' : 'Change Image'}
              </Button>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={uploading}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box>
            {uploading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">
                  Uploading image...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="body1" fontWeight="medium">
                  Upload {type} image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop an image here, or click to select
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Max size: {maxSize}MB • Formats: JPG, PNG, WebP
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  Choose File
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;
