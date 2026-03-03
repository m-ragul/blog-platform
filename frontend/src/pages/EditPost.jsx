import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import postService from '../services/postService';
import categoryService from '../services/categoryService';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import ImageUpload from '../components/common/ImageUpload';
import RichTextEditor from '../components/common/RichTextEditor';
import Spinner from '../components/common/Spinner';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    tags: '',
    status: 'DRAFT',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const data = await postService.getPostById(id);
      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || '',
        categoryId: data.category?.id || '',
        tags: data.tags?.map((tag) => tag.name).join(', ') || '',
        status: data.status,
      });
    } catch (error) {
      toast.error('Post not found');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content,
    });
  };

  const handleImageUpload = (url) => {
    setFormData({
      ...formData,
      featuredImage: url,
    });
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setSubmitting(true);

    try {
      const postData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
        status,
      };

      await postService.updatePost(id, postData);
      toast.success('Post updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="glass-card p-10">
        <h1 className="text-4xl font-black text-white mb-10 tracking-tight">Refine <span className="text-gradient">Creation.</span></h1>

        <form className="space-y-2">
          <Input
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Update your masterpiece title"
            required
          />

          <Textarea
            label="Excerpt (Optional)"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Refine the hook"
            rows={3}
          />

          <div className="mb-8 px-1">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
              Content <span className="text-electric-blue">*</span>
            </label>
            <div className="glass-card !bg-white/5 !rounded-xl border-white/5 focus-within:border-electric-blue/30 transition-all overflow-hidden">
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Unleash your creativity..."
              />
            </div>
          </div>

          <div className="mb-8">
            <ImageUpload
              onImageUpload={handleImageUpload}
              existingImage={formData.featuredImage}
              label="Featured Visual"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="px-1">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                Classification
              </label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-5 py-3 glass-card !bg-white/5 !rounded-xl border-white/5 focus:border-electric-blue/50 focus:bg-white/10 outline-none appearance-none transition-all duration-300 text-white font-medium"
                >
                  <option value="" className="bg-midnight">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-midnight">
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <Input
              label="Tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. technology, design, life"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-10 border-t border-white/5">
            <Button
              type="button"
              onClick={() => handleSubmit('DRAFT')}
              variant="secondary"
              className="flex-1 !py-4"
              loading={submitting}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('PUBLISHED')}
              variant="primary"
              className="flex-1 !py-4 shadow-xl shadow-electric-violet/20"
              loading={submitting}
            >
              Update & Publish
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex-1 !py-4"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;