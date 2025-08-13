import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

const ArticleEditor = ({ article, onSave, onCancel }: ArticleEditorProps) => {
  const { language } = useLanguage();
  const isNewArticle = !article;
  const [activeTab, setActiveTab] = useState<'en' | 'mn'>('en');
  
  const [formData, setFormData] = useState<Article>({
    id: article?.id || uuidv4(),
    title: article?.title || { en: '', mn: '' },
    content: article?.content || { en: '', mn: '' },
    summary: article?.summary || { en: '', mn: '' },
    category: article?.category || 'news',
    author: article?.author || '',
    publishDate: article?.publishDate || new Date().toISOString().split('T')[0],
    imageUrl: article?.imageUrl || '',
    tags: article?.tags || [],
    featured: article?.featured || false
  });
  
  const [tagInput, setTagInput] = useState('');
  
  const categories = [
    { value: 'announcement', label: { en: 'Announcement', mn: 'Зарлал' } },
    { value: 'news', label: { en: 'News', mn: 'Мэдээ' } },
    { value: 'results', label: { en: 'Results', mn: 'Үр дүн' } },
    { value: 'interview', label: { en: 'Interview', mn: 'Ярилцлага' } },
    { value: 'workshop', label: { en: 'Workshop', mn: 'Семинар' } },
    { value: 'partnership', label: { en: 'Partnership', mn: 'Хамтын ажиллагаа' } }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.en || !formData.title.mn) {
      toast.error(language === 'en' 
        ? 'Title is required in both languages' 
        : 'Гарчиг хоёр хэл дээр шаардлагатай');
      return;
    }
    
    if (!formData.content.en || !formData.content.mn) {
      toast.error(language === 'en' 
        ? 'Content is required in both languages' 
        : 'Агуулга хоёр хэл дээр шаардлагатай');
      return;
    }
    
    if (!formData.author) {
      toast.error(language === 'en' ? 'Author is required' : 'Зохиогч шаардлагатай');
      return;
    }
    
    onSave(formData);
    toast.success(language === 'en' 
      ? 'Article saved successfully' 
      : 'Мэдээлэл амжилттай хадгалагдлаа');
  };
  
  const handleChange = (
    field: keyof Article,
    value: string | boolean | string[],
    languageKey?: 'en' | 'mn'
  ) => {
    if (languageKey) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field as keyof Pick<Article, 'title' | 'content' | 'summary'>],
          [languageKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language tabs for content editing */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'en' | 'mn')} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="mn">Монгол</TabsTrigger>
        </TabsList>
        
        <TabsContent value="en" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title-en">Title (English)</Label>
            <Input
              id="title-en"
              value={formData.title.en}
              onChange={(e) => handleChange('title', e.target.value, 'en')}
              placeholder="Enter article title in English"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary-en">Summary (English)</Label>
            <Textarea
              id="summary-en"
              value={formData.summary.en}
              onChange={(e) => handleChange('summary', e.target.value, 'en')}
              placeholder="Enter a brief summary in English"
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content-en">Content (English)</Label>
            <Textarea
              id="content-en"
              value={formData.content.en}
              onChange={(e) => handleChange('content', e.target.value, 'en')}
              placeholder="Enter article content in English"
              required
              rows={12}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="mn" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title-mn">Title (Монгол)</Label>
            <Input
              id="title-mn"
              value={formData.title.mn}
              onChange={(e) => handleChange('title', e.target.value, 'mn')}
              placeholder="Мэдээллийн гарчиг оруулна уу"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary-mn">Summary (Монгол)</Label>
            <Textarea
              id="summary-mn"
              value={formData.summary.mn}
              onChange={(e) => handleChange('summary', e.target.value, 'mn')}
              placeholder="Товч агуулга оруулна уу"
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content-mn">Content (Монгол)</Label>
            <Textarea
              id="content-mn"
              value={formData.content.mn}
              onChange={(e) => handleChange('content', e.target.value, 'mn')}
              placeholder="Мэдээллийн агуулга оруулна уу"
              required
              rows={12}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Common fields for both languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'en' ? 'Select a category' : 'Ангилал сонгоно уу'} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {language === 'en' ? category.label.en : category.label.mn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            placeholder={language === 'en' ? 'Enter author name' : 'Зохиогчийн нэр оруулна уу'}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="date"
            value={formData.publishDate}
            onChange={(e) => handleChange('publishDate', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder={language === 'en' ? 'Enter image URL' : 'Зургийн URL оруулна уу'}
          />
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={language === 'en' ? 'Add a tag' : 'Шошго нэмэх'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag}>
            {language === 'en' ? 'Add' : 'Нэмэх'}
          </Button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center text-sm">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Featured checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleChange('featured', !!checked)}
        />
        <Label htmlFor="featured">
          {language === 'en' ? 'Featured article (shown on homepage)' : 'Онцлох мэдээ (нүүр хуудсанд харуулах)'}
        </Label>
      </div>
      
      {/* Preview card */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">
            {language === 'en' ? 'Preview' : 'Урьдчилан харах'}
          </h3>
          <div className="border rounded-md p-4 bg-muted/50">
            <h4 className="font-bold text-xl">
              {formData.title[language] || 
                (language === 'en' ? '[Title in English]' : '[Монгол гарчиг]')}
            </h4>
            <p className="text-muted-foreground text-sm mt-1">
              {formData.author} • {formData.publishDate}
            </p>
            <p className="mt-3 line-clamp-3">
              {formData.summary[language] || 
                (language === 'en' ? '[Summary in English]' : '[Монгол товч агуулга]')}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === 'en' ? 'Cancel' : 'Цуцлах'}
        </Button>
        <Button type="submit">
          {isNewArticle 
            ? (language === 'en' ? 'Create Article' : 'Мэдээ үүсгэх')
            : (language === 'en' ? 'Update Article' : 'Мэдээ шинэчлэх')
          }
        </Button>
      </div>
    </form>
  );
};

export default ArticleEditor;