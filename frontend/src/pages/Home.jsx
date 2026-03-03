import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import postService from '../services/postService';
import categoryService from '../services/categoryService';
import PostCard from '../components/posts/PostCard';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    last: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async (pageNo = 0, categoryId = null, keyword = '') => {
    setLoading(true);
    try {
      let data;

      if (keyword) {
        // Search with optional category filter
        data = await postService.searchPosts(keyword, categoryId, pageNo, pagination.pageSize);
      } else if (categoryId) {
        // Filter by category only
        data = await postService.getPostsByCategory(categoryId, pageNo, pagination.pageSize);
      } else {
        // Get all posts
        data = await postService.getAllPosts(pageNo, pagination.pageSize);
      }

      setPosts(data.content);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        last: data.last,
      });
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchKeyword(''); // Clear search when filtering by category
    setPagination({ ...pagination, pageNo: 0 });
    fetchPosts(0, categoryId, '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      // If search is empty, just show all or category filtered posts
      fetchPosts(0, selectedCategory, '');
      return;
    }
    setPagination({ ...pagination, pageNo: 0 });
    fetchPosts(0, selectedCategory, searchKeyword);
  };

  const loadMore = () => {
    fetchPosts(pagination.pageNo + 1, selectedCategory, searchKeyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-smooth">
      {/* Hero Section */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-violet/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tightest">
          <span className="text-white">Write.</span>
          <span className="text-gradient">Share.</span>
          <span className="text-white/20">Connect.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Embark on a journey through stories, thinking, and expertise from the world's most creative minds.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-16 relative z-10">
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-3 p-1.5 glass-card !rounded-2xl border-white/5 ring-1 ring-black/20">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for something awesome..."
              className="flex-1 bg-transparent px-5 py-3 text-white placeholder-slate-500 outline-none font-medium"
            />
            <Button type="submit" variant="primary" className="!rounded-xl shadow-lg">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-16 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-6 py-2 rounded-xl font-bold tracking-tight transition-all duration-300 border ${selectedCategory === null
                ? 'bg-electric-violet text-white border-electric-violet shadow-lg shadow-electric-violet/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
          >
            Explore All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-6 py-2 rounded-xl font-bold tracking-tight transition-all duration-300 border ${selectedCategory === category.id
                  ? 'bg-electric-violet text-white border-electric-violet shadow-lg shadow-electric-violet/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass-card mx-auto max-w-lg border-dashed">
          <p className="text-xl text-slate-400 font-medium italic">"The best way to start is to write."</p>
          <p className="text-slate-500 mt-2">No posts found for this view.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Button */}
          {!pagination.last && (
            <div className="flex justify-center">
              <Button onClick={loadMore} variant="secondary" className="px-10 border-white/20 glass-card !bg-white/5">
                Load More Discoveries
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;