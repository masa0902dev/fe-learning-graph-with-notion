export async function fetchFETasks(): Promise<Task[]> {
  const PORT = process.env.REACT_APP_PORT || 4000;
  const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || `http://localhost:${PORT}`;
  const url = `${PUBLIC_URL}/api/fetasks`;
  const res = await fetch(url);
  const data: Task[] = await res.json();
  return data;
}

export interface Task {
  // id: string;
  date: string;
  sum: number;
  // span: number;
}
