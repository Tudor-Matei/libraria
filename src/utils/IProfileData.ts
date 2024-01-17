export interface IProfileData {
  userStats: IUserStats | null;
  userTransactions: IUserTransaction[] | null;
}

export interface IUserTransaction {
  id: number;
  name: string;
  price: number;
  date: string;
}

export interface IUserStats {
  books_bought_this_month: number;
  books_bought_in_total: number;
  most_expensive_book_bought: { name: string; price: number };
  total_money_spent_books: number;
}
