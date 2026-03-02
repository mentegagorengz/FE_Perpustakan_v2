export interface Article {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  status: "Published" | "Draft";
}

export interface Book {
  id: number;
  title: string;
  mainAuthor: string;
  category: string;
  availability: number;
  imageUrl: string;
  description: string;
  isbn: string;
  publisher: string;
  year: string;
  language: string;
}

export interface Borrowing {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "returned" | "overdue";
  fine: number;
}

export interface PolicyConfig {
  dailyFine: number;
  maxBorrowDays: number;
  maxBooksPerUser: number;
}

export interface AuditLog {
  id: number;
  admin: string;
  action: string;
  target: string;
  time: string;
  status: "Critical" | "Warning" | "Info";
}

export interface AppUser {
  id: string;
  nama: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "banned";
  joinDate: string;
}
