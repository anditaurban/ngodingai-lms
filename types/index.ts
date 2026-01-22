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