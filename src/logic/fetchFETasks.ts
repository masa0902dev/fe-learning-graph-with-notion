export async function fetchFETasks(): Promise<Task[]> {
  const PORT = process.env.REACT_APP_PORT || 4000;
  const url = `http://localhost:${PORT}/api/fetasks`;
  const response = await fetch(url);
  const data: Task[] = await response.json();
  return data;
}

export interface Task {
  // id: string;
  date: string;
  sum: number;
  // span: number;
}
