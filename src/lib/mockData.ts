import { Article, Event, Competition, MediaItem, Sponsor } from '@/types';

// Mock Articles
export const articles: Article[] = [
  {
    id: '1',
    title: {
      en: 'MAIO 2025 Registration Now Open',
      mn: 'MAIO 2025 бүртгэл нээлттэй боллоо'
    },
    content: {
      en: 'Registration for the Mongolian AI Olympiad 2025 is now open. Join us for the most exciting AI competition in Mongolia. This year features new categories including Natural Language Processing, Computer Vision, and Reinforcement Learning.',
      mn: 'Монголын AI Олимпиад 2025-д бүртгүүлэх боломжтой боллоо. Монгол улсын хамгийн сонирхолтой AI тэмцээнд оролцоорой. Энэ жил Байгалийн хэлний боловсруулалт, Компьютер харааны технологи, Reinforcement Learning зэрэг шинэ төрлүүд нэмэгдлээ.'
    },
    summary: {
      en: 'Join the most exciting AI competition in Mongolia with new categories.',
      mn: 'Монгол улсын хамгийн сонирхолтой AI тэмцээнд шинэ төрлүүдтэйгээр оролцоорой.'
    },
    category: 'announcement',
    author: 'MAIO Team',
    publishDate: '2025-05-10',
    imageUrl: '/images/Registration.jpg',
    tags: ['registration', 'competition', '2025'],
    featured: true
  },
  {
    id: '2',
    title: {
      en: 'Results of MAIO 2024 Announced',
      mn: 'MAIO 2024 үр дүн зарлагдлаа'
    },
    content: {
      en: 'We are pleased to announce the results of the Mongolian AI Olympiad 2024. After a fierce competition, Team AlphaQuest has won the grand prize with their innovative solution for urban traffic optimization using reinforcement learning.',
      mn: 'Бид Монголын AI Олимпиад 2024-ийн үр дүнг танилцуулахад таатай байна. Хүчтэй өрсөлдөөний дараа AlphaQuest баг reinforcement learning ашиглан хотын замын хөдөлгөөнийг оновчлох шинэлэг шийдлээрээ тэргүүн байр эзэлжээ.'
    },
    summary: {
      en: 'Team AlphaQuest wins MAIO 2024 with their urban traffic optimization solution.',
      mn: 'AlphaQuest баг хотын замын хөдөлгөөн оновчлох шийдлээрээ MAIO 2024-т түрүүллээ.'
    },
    category: 'results',
    author: 'Judging Committee',
    publishDate: '2024-12-15',
    imageUrl: '/assets/images/results2024.jpg',
    tags: ['results', '2024', 'winners']
  },
  {
    id: '3',
    title: {
      en: 'Interview with Last Year\'s Winner',
      mn: 'Өнгөрсөн жилийн ялагчтай хийсэн ярилцлага'
    },
    content: {
      en: 'We sat down with Batbold Ganbold, the leader of Team Nomad AI, who won the MAIO 2023. He shared insights about their winning strategy, preparation process, and gave advice for participants this year.',
      mn: 'Бид MAIO 2023-т түрүүлсэн Nomad AI багийн ахлагч Ганболдын Батболдтой уулзаж, тэдний ялалтын стратеги, бэлтгэл үйл явц, мөн энэ жилийн оролцогчдод зориулсан зөвлөгөөг хуваалцлаа.'
    },
    summary: {
      en: 'Insights and advice from last year\'s MAIO winner, Batbold Ganbold.',
      mn: 'Өнгөрсөн жилийн MAIO ялагч Ганболдын Батболдын туршлага, зөвлөгөө.'
    },
    category: 'interview',
    author: 'Oyunbileg Tsend',
    publishDate: '2024-06-05',
    imageUrl: '/assets/images/interview.jpg',
    tags: ['interview', 'winners', '2023']
  },
  {
    id: '4',
    title: {
      en: 'New Partnership with Google DeepMind',
      mn: 'Google DeepMind-тэй шинэ хамтын ажиллагаа'
    },
    content: {
      en: 'The Mongolian AI Olympiad is proud to announce a new partnership with Google DeepMind. This collaboration will bring world-class AI expertise, resources, and mentorship opportunities to MAIO participants.',
      mn: 'Монголын AI Олимпиад Google DeepMind-тэй шинэ хамтын ажиллагааг зарлахад бахархалтай байна. Энэхүү хамтын ажиллагаа нь MAIO оролцогчдод дэлхийн хэмжээний AI мэргэжил, нөөц, зөвлөх боломжуудыг авчрах болно.'
    },
    summary: {
      en: 'MAIO announces new partnership with Google DeepMind, bringing world-class AI expertise to participants.',
      mn: 'MAIO Google DeepMind-тэй хамтран ажиллаж, оролцогчдод дэлхийн хэмжээний AI мэргэжил олгоно.'
    },
    category: 'partnership',
    author: 'MAIO Board',
    publishDate: '2024-07-20',
    imageUrl: '/assets/images/partnership.jpg',
    tags: ['partnership', 'Google', 'DeepMind']
  },
  {
    id: '5',
    title: {
      en: 'Workshop: Introduction to Large Language Models',
      mn: 'Семинар: Том хэлний загваруудын танилцуулга'
    },
    content: {
      en: 'Join our pre-competition workshop on Large Language Models. Learn about the architecture, training methods, and practical applications of LLMs from industry experts. The workshop will be held online on September 15, 2024.',
      mn: 'Том хэлний загваруудын тухай урьдчилсан семинарт оролцоорой. Салбарын мэргэжилтнүүдээс LLM-ийн архитектур, сургалтын аргууд, практик хэрэглээний талаар суралцаарай. Семинар 2024 оны 9-р сарын 15-нд онлайнаар зохион байгуулагдана.'
    },
    summary: {
      en: 'Online workshop on Large Language Models scheduled for September 15, 2024.',
      mn: '2024 оны 9-р сарын 15-нд Том хэлний загваруудын онлайн семинар зохион байгуулагдана.'
    },
    category: 'workshop',
    author: 'Dr. Enkhjargal Dorj',
    publishDate: '2024-08-01',
    imageUrl: '/assets/images/workshop.jpg',
    tags: ['workshop', 'LLM', 'training']
  }
];

// Mock Events
export const events: Event[] = [
  {
    id: '1',
    title: {
      en: 'MAIO 2025 Opening Ceremony',
      mn: 'MAIO 2025 Нээлтийн Ёслол'
    },
    description: {
      en: 'The official opening ceremony for MAIO 2025, featuring keynote speeches from industry leaders and government officials.',
      mn: 'MAIO 2025-ын албан ёсны нээлтийн ёслол, салбарын тэргүүлэгчид болон төрийн албаны хүмүүсийн үг хэлэх.'
    },
    date: '2025-09-10',
    time: '10:00',
    location: 'Ulaanbaatar, Blue Sky Tower Conference Hall',
    imageUrl: '/assets/images/opening-ceremony.jpg'
  },
  {
    id: '2',
    title: {
      en: 'Technical Workshop: Computer Vision',
      mn: 'Техникийн семинар: Компьютер харааны технологи'
    },
    description: {
      en: 'A hands-on workshop focusing on the latest advancements in computer vision technologies and their applications.',
      mn: 'Компьютер харааны технологийн сүүлийн үеийн дэвшил, түүний хэрэглээний талаар практик семинар.'
    },
    date: '2025-09-15',
    time: '14:00',
    location: 'National University of Mongolia, Room 305',
    imageUrl: '/assets/images/cv-workshop.jpg'
  },
  {
    id: '3',
    title: {
      en: 'Preliminary Round',
      mn: 'Урьдчилсан шат'
    },
    description: {
      en: 'The first round of the competition where teams will work on solving initial challenges.',
      mn: 'Багууд анхан шатны сорилтуудыг шийдвэрлэх тэмцээний эхний шат.'
    },
    date: '2025-09-20',
    time: '09:00',
    location: 'Online',
    imageUrl: '/assets/images/preliminary.jpg'
  }
];

// Mock Competitions
export const competitions: Competition[] = [
  {
    id: '1',
    name: {
      en: 'MAIO 2024',
      mn: 'MAIO 2024'
    },
    year: '2024',
    winners: [
      { place: 1, name: 'Team AlphaQuest', project: 'Urban Traffic Optimization using Reinforcement Learning', score: 95 },
      { place: 2, name: 'Team NeuralNomads', project: 'Mongolian Sign Language Recognition System', score: 92 },
      { place: 3, name: 'Team DeepSteppe', project: 'Drought Prediction using Satellite Imagery', score: 88 }
    ]
  },
  {
    id: '2',
    name: {
      en: 'MAIO 2023',
      mn: 'MAIO 2023'
    },
    year: '2023',
    winners: [
      { place: 1, name: 'Team Nomad AI', project: 'Automated Livestock Health Monitoring', score: 94 },
      { place: 2, name: 'Team Gobi Tech', project: 'Air Quality Prediction for Ulaanbaatar', score: 91 },
      { place: 3, name: 'Team DataHerders', project: 'Mongolian Language Sentiment Analysis', score: 87 }
    ]
  }
];

// Mock Media Items
export const mediaItems: MediaItem[] = [
  {
    id: '1',
    title: {
      en: 'MAIO 2024 Winners',
      mn: 'MAIO 2024 Ялагчид'
    },
    type: 'image',
    url: '/assets/images/gallery/winners2024.jpg',
    date: '2024-12-15',
    category: 'event'
  },
  {
    id: '2',
    title: {
      en: 'Workshop Session',
      mn: 'Семинарын хичээл'
    },
    type: 'image',
    url: '/assets/images/gallery/workshop.jpg',
    date: '2024-09-15',
    category: 'workshop'
  },
  {
    id: '3',
    title: {
      en: 'Interview with Dr. Enkhbold',
      mn: 'Др. Энхболдтой хийсэн ярилцлага'
    },
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/assets/images/gallery/interview-thumbnail.jpg',
    date: '2024-08-05',
    category: 'interview'
  }
];

// Mock Sponsors
export const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Google DeepMind',
    logoUrl: '/assets/images/sponsors/google-deepmind.svg',
    websiteUrl: 'https://deepmind.google/',
    tier: 'platinum'
  },
  {
    id: '2',
    name: 'Mongolian National University',
    logoUrl: '/assets/images/sponsors/mnu.svg',
    websiteUrl: 'https://www.mnu.edu.mn',
    tier: 'gold'
  },
  {
    id: '3',
    name: 'Ministry of Digital Development',
    logoUrl: '/assets/images/sponsors/mdd.svg',
    websiteUrl: 'https://www.mdd.gov.mn',
    tier: 'gold'
  },
  {
    id: '4',
    name: 'Artificial Intelligence Association of Mongolia',
    logoUrl: '/images/ArtificialIntelligence.jpg',
    websiteUrl: 'https://www.aiam.mn',
    tier: 'silver'
  }
];

// Helper function to get featured articles
export const getFeaturedArticles = (): Article[] => {
  return articles.filter(article => article.featured);
};

// Helper function to get latest articles
export const getLatestArticles = (count: number = 5): Article[] => {
  return [...articles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
};

// Helper function to get articles by category
export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter(article => article.category === category);
};

// Helper function to search articles
export const searchArticles = (query: string): Article[] => {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(article => 
    article.title.en.toLowerCase().includes(lowercaseQuery) || 
    article.title.mn.toLowerCase().includes(lowercaseQuery) || 
    article.content.en.toLowerCase().includes(lowercaseQuery) || 
    article.content.mn.toLowerCase().includes(lowercaseQuery) || 
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Helper function to get upcoming events
export const getUpcomingEvents = (): Event[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return [...events]
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};