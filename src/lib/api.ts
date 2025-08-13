const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

// News API functions
export const newsApi = {
  // Get all news with filters
  async getNews(filters: NewsFilters = {}): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/api/news?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        data: result.articles,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  // Get single news article
  async getArticle(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/api/news/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const article = await response.json();
      
      return { data: article };
    } catch (error) {
      console.error('Error fetching article:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  // Create new article
  async createArticle(articleData: any, imageFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(articleData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/api/news`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error creating article:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create article'
      };
    }
  },

  // Update article
  async updateArticle(id: string, articleData: any, imageFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(articleData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/api/news/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error updating article:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update article'
      };
    }
  },

  // Delete article
  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {};
    } catch (error) {
      console.error('Error deleting article:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete article'
      };
    }
  },

  // Get categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_URL}/api/news/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categories = await response.json();
      
      return { data: categories };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      };
    }
  }
};

// Events API functions
export const eventsApi = {
  async getEvents(filters: { page?: number; limit?: number; category?: string; search?: string; upcoming?: boolean } = {}): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/api/events?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        data: result.events,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getEvent(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const event = await response.json();
      
      return { data: event };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async createEvent(eventData: any, imageFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(eventData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  },

  async updateEvent(id: string, eventData: any, imageFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(eventData));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update event'
      };
    }
  },

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {};
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete event'
      };
    }
  }
};

// Media API functions
export const mediaApi = {
  async getMedia(filters: { page?: number; limit?: number; type?: string; search?: string } = {}): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/api/media?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        data: result.mediaItems,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching media:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async uploadMedia(data: { title: string; description?: string; tags?: string[]; category?: string }, file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      if (data.category) formData.append('category', data.category);

      const response = await fetch(`${API_URL}/api/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error uploading media:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to upload media'
      };
    }
  },

  async deleteMedia(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Media not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {};
    } catch (error) {
      console.error('Error deleting media:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete media'
      };
    }
  }
};

// Results API functions
export const resultsApi = {
  async getResults(filters: { page?: number; limit?: number; category?: string; year?: number; search?: string } = {}): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/api/results?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        data: result.results,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error fetching results:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async createResult(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error creating result:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create result'
      };
    }
  },

  async updateResult(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_URL}/api/results/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Result not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error updating result:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update result'
      };
    }
  },

  async deleteResult(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/results/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Result not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {};
    } catch (error) {
      console.error('Error deleting result:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete result'
      };
    }
  }
};

// Sponsors API functions
export const sponsorsApi = {
  async getSponsors(activeOnly = false): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (activeOnly) queryParams.append('active', 'true');

      const response = await fetch(`${API_URL}/api/sponsors?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  // Alias for compatibility with existing code
  async getAll(): Promise<any[]> {
    try {
      const response = await this.getSponsors(true);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all sponsors:', error);
      return [];
    }
  },

  async createSponsor(data: any, logoFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_URL}/api/sponsors`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error creating sponsor:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create sponsor'
      };
    }
  },

  async updateSponsor(id: string, data: any, logoFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await fetch(`${API_URL}/api/sponsors/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sponsor not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return { data: result };
    } catch (error) {
      console.error('Error updating sponsor:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update sponsor'
      };
    }
  },

  async deleteSponsor(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/sponsors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sponsor not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {};
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete sponsor'
      };
    }
  }
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
