import { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import uploadService from '../../services/uploadService';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUpload, existingImage = null, label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(existingImage);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      setImageUrl(response.url);
      onImageUpload(response.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    onImageUpload(null);
  };

  return (
    <div className="mb-8 px-1">
      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
        {label}
      </label>

      {!imageUrl ? (
        <div className="glass-card !bg-white/5 !rounded-2xl border-dashed border-white/10 p-10 text-center hover:border-electric-blue/50 hover:bg-white/10 transition-all group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-linear-to-br from-electric-violet/20 to-electric-blue/20 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
              <FaCloudUploadAlt className="text-4xl text-electric-blue" />
            </div>
            <p className="text-white font-bold mb-2">
              {uploading ? 'Transmitting data...' : 'Summon your visual asset'}
            </p>
            <p className="text-sm text-slate-500 font-medium italic">High-fidelity PNG, JPG, or GIF up to 5MB</p>
          </label>
        </div>
      ) : (
        <div className="relative group">
          <div className="glass-card !bg-white/5 !rounded-2xl border-white/10 overflow-hidden">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-80 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 bg-rose-500/80 text-white h-10 w-10 flex items-center justify-center rounded-xl hover:bg-rose-500 transition-all shadow-xl backdrop-blur-md"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;