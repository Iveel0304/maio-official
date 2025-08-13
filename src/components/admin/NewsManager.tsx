import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Upload,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Article {
  _id?: string;
  title: {
    en: string;
    mn: string;
  };
  content: {
    en: string;
    mn: string;
  };
  summary: {
    en: string;
    mn: string;
  };
  category: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  imageUrl?: string;
  tags: string[];
  featured?: boolean;
}

export default function NewsManager() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  // Form state
  const [formData, setFormData] = useState<Article>({
    title: { en: '', mn: '' },
    content: { en: '', mn: '' },
    summary: { en: '', mn: '' },
    category: '',
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  // Load articles
  const loadArticles = async (page = 1) => {
    setLoading(true);
    const filters = {
      page,
      limit: 10,
      ...(selectedCategory !== 'all' && { category: selectedCategory }),
      ...(searchTerm && { search: searchTerm })
    };

    const result = await newsApi.getNews(filters);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      setArticles(result.data || []);
      setPagination(result.pagination || { current: 1, pages: 1, total: 0 });
    }
    setLoading(false);
  };

  // Load categories
  const loadCategories = async () => {
    const result = await newsApi.getCategories();
    if (result.data) {
      setCategories(result.data);
    }
  };

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, [selectedCategory, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const articleData = {
      ...formData,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setLoading(true);
    
    let result;
    if (editingArticle?._id) {
      result = await newsApi.updateArticle(editingArticle._id, articleData, imageFile || undefined);
    } else {
      result = await newsApi.createArticle(articleData, imageFile || undefined);
    }

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingArticle ? 'Article updated successfully' : 'Article created successfully');
      setShowEditor(false);
      resetForm();
      loadArticles();
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const result = await newsApi.deleteArticle(id);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Article deleted successfully');
      loadArticles();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: { en: '', mn: '' },
      content: { en: '', mn: '' },
      summary: { en: '', mn: '' },
      category: '',
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
      featured: false
    });
    setImageFile(null);
    setTagsInput('');
    setEditingArticle(null);
  };

  // Open editor for editing
  const openEditor = (article?: Article) => {
    if (article) {
      setFormData(article);
      setTagsInput(article.tags.join(', '));
      setEditingArticle(article);
    } else {
      resetForm();
    }
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'News Management' : 'Мэдээ удирдлага'}
        </h1>
        <Button onClick={() => openEditor()}>
          <Plus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'New Article' : 'Шинэ мэдээ'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {language === 'en' ? 'Filters' : 'Шүүлтүүр'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Search' : 'Хайх'}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'en' ? 'Search articles...' : 'Мэдээ хайх...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Category' : 'Ангилал'}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'en' ? 'All Categories' : 'Бүх ангилал'}
                  </SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Articles' : 'Мэдээнүүд'} ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Title' : 'Гарчиг'}</TableHead>
                  <TableHead>{language === 'en' ? 'Category' : 'Ангилал'}</TableHead>
                  <TableHead>{language === 'en' ? 'Author' : 'Зохиогч'}</TableHead>
                  <TableHead>{language === 'en' ? 'Date' : 'Огноо'}</TableHead>
                  <TableHead>{language === 'en' ? 'Status' : 'Төлөв'}</TableHead>
                  <TableHead>{language === 'en' ? 'Actions' : 'Үйлдэл'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{article.title[language]}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {article.summary[language]}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{article.category}</Badge>
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(article.publishDate), 'PPP')}</p>
                        {article.updatedDate && (
                          <p className="text-muted-foreground">
                            Updated: {format(new Date(article.updatedDate), 'PP')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.featured && (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditor(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === 'en' ? 'Delete Article' : 'Мэдээ устгах'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {language === 'en' 
                                  ? 'Are you sure you want to delete this article? This action cannot be undone.'
                                  : 'Та энэ мэдээг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {language === 'en' ? 'Cancel' : 'Цуцлах'}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => article._id && handleDelete(article._id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                {language === 'en' ? 'Delete' : 'Устгах'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={pagination.current === 1}
                onClick={() => loadArticles(pagination.current - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.current} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.current === pagination.pages}
                onClick={() => loadArticles(pagination.current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle 
                ? (language === 'en' ? 'Edit Article' : 'Мэдээ засах')
                : (language === 'en' ? 'New Article' : 'Шинэ мэдээ')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title EN */}
              <div className="space-y-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={formData.title.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, en: e.target.value }
                  })}
                  required
                />
              </div>

              {/* Title MN */}
              <div className="space-y-2">
                <Label htmlFor="title-mn">Title (Mongolian)</Label>
                <Input
                  id="title-mn"
                  value={formData.title.mn}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, mn: e.target.value }
                  })}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="results">Results</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            {/* Summary EN */}
            <div className="space-y-2">
              <Label htmlFor="summary-en">Summary (English)</Label>
              <Textarea
                id="summary-en"
                value={formData.summary.en}
                onChange={(e) => setFormData({
                  ...formData,
                  summary: { ...formData.summary, en: e.target.value }
                })}
                rows={3}
                required
              />
            </div>

            {/* Summary MN */}
            <div className="space-y-2">
              <Label htmlFor="summary-mn">Summary (Mongolian)</Label>
              <Textarea
                id="summary-mn"
                value={formData.summary.mn}
                onChange={(e) => setFormData({
                  ...formData,
                  summary: { ...formData.summary, mn: e.target.value }
                })}
                rows={3}
                required
              />
            </div>

            {/* Content EN */}
            <div className="space-y-2">
              <Label>Content (English)</Label>
              <RichTextEditor
                content={formData.content.en}
                onChange={(content) => setFormData({
                  ...formData,
                  content: { ...formData.content, en: content }
                })}
              />
            </div>

            {/* Content MN */}
            <div className="space-y-2">
              <Label>Content (Mongolian)</Label>
              <RichTextEditor
                content={formData.content.mn}
                onChange={(content) => setFormData({
                  ...formData,
                  content: { ...formData.content, mn: content }
                })}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {formData.imageUrl && (
                <img 
                  src={formData.imageUrl} 
                  alt="Current" 
                  className="w-32 h-20 object-cover rounded"
                />
              )}
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Article</Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditor(false)}>
                {language === 'en' ? 'Cancel' : 'Цуцлах'}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingArticle ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
