import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Video, FileText, Trash2, Plus, Search, Filter, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mediaApi } from '@/lib/api';
import { toast } from 'sonner';

interface MediaItem {
  id?: string;
  title: string;
  description?: string;
  category: string;
  type: 'image' | 'video' | 'other';
  url: string;
  filename: string;
  originalName: string;
  tags?: string[];
  size: number;
  mimetype: string;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  'ceremony',
  'competition',
  'workshop',
  'gallery',
  'guide',
  'announcement',
  'uncategorized'
];

const types = ['image', 'video', 'other'];

export default function MediaManager() {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'uncategorized',
    tags: [] as string[]
  });
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all'
  });
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchMedia();
  }, [filters]);

  const fetchMedia = async (page = 1) => {
    setLoading(true);
    try {
      const response = await mediaApi.getMedia({
        page,
        limit: 20,
        type: filters.type === 'all' ? undefined : filters.type,
        search: filters.search || undefined
      });
      
      if (response.error) {
        toast.error(response.error);
      } else {
        setMediaItems(response.data || []);
        setPagination(response.pagination || { current: 1, pages: 1, total: 0 });
      }
    } catch (error) {
      toast.error('Failed to fetch media items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title.trim()) {
      toast.error('Please select a file and provide a title');
      return;
    }

    setUploading(true);
    try {
      const response = await mediaApi.uploadMedia(uploadData, selectedFile);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Media uploaded successfully');
        setIsUploadDialogOpen(false);
        resetUploadForm();
        fetchMedia();
      }
    } catch (error) {
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const response = await mediaApi.deleteMedia(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Media deleted successfully');
        fetchMedia();
      }
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadData({
      title: '',
      description: '',
      category: 'uncategorized',
      tags: []
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Media Management' : 'Медиа удирдах'}
        </h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Upload Media' : 'Медиа оруулах'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Upload New Media' : 'Шинэ медиа оруулах'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter media title..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter media description..."
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadData.category}
                  onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={uploadData.tags.join(', ')}
                  onChange={(e) => setUploadData(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  placeholder="tag1, tag2, tag3..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    resetUploadForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={language === 'en' ? 'Search media...' : 'Медиа хайх...'}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {mediaItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            {language === 'en' ? 'No media items found' : 'Медиа олдсонгүй'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : item.type === 'video' ? (
                  <div className="flex items-center justify-center h-full">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {item.type}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold truncate" title={item.title}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline">{item.category}</Badge>
                    <span>{formatFileSize(item.size)}</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(item.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            disabled={pagination.current === 1}
            onClick={() => fetchMedia(pagination.current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.current} of {pagination.pages}
          </span>
          <Button 
            variant="outline" 
            disabled={pagination.current === pagination.pages}
            onClick={() => fetchMedia(pagination.current + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
