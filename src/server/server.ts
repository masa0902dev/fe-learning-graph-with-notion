import express, { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import cors from 'cors';

const app = express();
const PORT = process.env.REACT_APP_PORT || 4000;
console.info('process.env.NOTION_API_KEY:', process.env.NOTION_API_KEY);
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_ID = 'b96bcf61cfc247b4881192013a1a970c';

type FilterQueryType = {
  and: [
    {
      property: string;
      rich_text: {
        equals: string;
      };
    },
    {
      property: string;
      status: {
        equals: string;
      };
    }
  ]
};

type SortQueryType = {
  property: string;
  direction: "ascending" | "descending";
};

const filterQuery: FilterQueryType = {
  and: [
    {
      property: 'task',
      rich_text: {
        equals: 'k',
      },
    },
    {
      property: 'status',
      status: {
        equals: 'Done',
      },
    },
  ],
};

const sortQuery: SortQueryType = {
  property: 'date',
  direction: 'ascending',
};

interface Task {
  id: string;
  date: string;
  sum: number;
  span: number;
}

async function fetchMatchedTask(): Promise<any> {
  try {
    const res = await notion.databases.query({
      database_id: DB_ID,
      filter: filterQuery,
      sorts: [sortQuery],
    });
    return res;
  } catch (error) {
    console.error(error);
  }
}

async function fetchNextProps(nextCursor: string): Promise<any> {
  try {
    const res = await notion.databases.query({
      database_id: DB_ID,
      start_cursor: nextCursor,
      filter: filterQuery,
      sorts: [sortQuery],
    });
    return res;
  } catch (error) {
    console.error(error);
  }
}

function makeRecord(results: any[]): Task[] {
  return results.map((result: any) => {
    return {
      id: result.id,
      date: result.properties.date.date.start,
      sum: result.properties.sum.formula.number,
      span: result.properties.span.formula.number,
    };
  });
}

app.get('/api/fetasks', async (req: Request, res: Response) => {
  const feTasksRes: any = await fetchMatchedTask();
  let feTasks: Task[] = makeRecord(feTasksRes.results);

  let hasMore: boolean = feTasksRes.has_more;
  while (hasMore) {
    const nextTasks: any = await fetchNextProps(feTasksRes.next_cursor);
    feTasks = feTasks.concat(makeRecord(nextTasks.results));
    hasMore = nextTasks.has_more;
  }
  res.json(feTasks);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
