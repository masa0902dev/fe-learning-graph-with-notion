import { Client } from "@notionhq/client";

const DB_ID = "b96bcf61cfc247b4881192013a1a970c";
console.info('API:', process.env.REACT_APP_NOTION_API_KEY);
const notion = new Client({ auth: process.env.REACT_APP_NOTION_API_KEY });
type filterQueryType = {
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
}
type sortQueryType = {
  property: string;
  direction: "ascending" | "descending";
};

const filterQuery: filterQueryType = {
  and: [
    {
      property: "task",
      rich_text: {
        equals: "k",
      },
    },
    {
      property: "status",
      status: {
        equals: "Done",
      },
    },
  ],
};
const sortQuery: sortQueryType = {
  property: "date",
  direction: "ascending",
}

async function fetchMatchedTask(taskName: string): Promise<any> {
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

async function fetchNextProps(nextCursor: string, taskName: string): Promise<any> {
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

interface Task {
  id: string;
  date: string;
  sum: number;
  span: number;
}
async function fetchFETasks(): Promise<Task[]> {
  const taskName = "k";
  const feTasksRes: any = await fetchMatchedTask(taskName);
  let feTasks = makeRecord(feTasksRes.results);

  let hasMore = feTasksRes.has_more;
  while (hasMore) {
    const nextTasks: any = await fetchNextProps(feTasksRes.next_cursor, taskName);
    feTasks = feTasks.concat(makeRecord(nextTasks.results));
    hasMore = nextTasks.has_more;
  }
  // feTasks.forEach((task) => {
  //   console.info('task:', task);
  // })
  // console.info("feTasks:", feTasks.length);
  return feTasks;
}
export const feTasks: Promise<Task[]> = fetchFETasks();
