export interface Article {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'article' | 'interview_question' | 'common_question';
  createdAt: number;
}

export interface Query {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
}

export interface Analytics {
  visits: number;
}
