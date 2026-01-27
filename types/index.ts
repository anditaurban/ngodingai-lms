// --- USER PROFILE TYPES ---
export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  socials: {
    linkedin: string;
    github: string;
  };
  stats: {
    attendance_rate: number;
    present: number;
    absent: number;
  };
  attendance_log: {
    date: string;
    class: string;
    status: string;
  }[];
  projects: {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
  }[];
  certificates: {
    id: string;
    title: string;
    date: string;
    image: string;
  }[];
}

// --- COURSE & LEARNING TYPES ---

export interface Video {
  id: string;
  title: string;
  youtube_id?: string;
  url?: string;
  duration: string;
  // PERBAIKAN: Menambahkan 'gdrive' ke dalam tipe union
  type?: 'youtube' | 'drive' | 'gdrive'; 
}

export interface Module {
  title: string;
  videos: Video[];
}

export interface Batch {
  id: string;
  name: string;
}

export interface ArticleStep {
  title: string;
  content: string;
}

export interface CourseData {
  slug: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  tabs: {
    overview: {
      about: string;
      tools: string[];
      audience?: string[];
    };
    preparation: {
      content_html: string;
      slides_id?: string;
      steps?: ArticleStep[];
    };
    curriculum?: Module[];
  };
}

export interface CurriculumData {
  batches: Batch[];
  content: Record<string, Module[]>;
}