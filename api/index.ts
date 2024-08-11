import express, { Request, Response } from "express";
import { Client } from "@notionhq/client";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Task } from "../src/logic/fetchTasks";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.REACT_APP_PORT || 4000;
app.use(express.json());
app.use(cors());

// parameter-----------------------------------
const TASK_PROPERTY = "task";
const EQUALS_OR_CONTAINS = "contains";

const DB_ID = "b96bcf61cfc247b4881192013a1a970c";
// parameter-----------------------------------

app.get("/api", async (req: Request, res: Response) => {
  res.json({
    message: "Hello, World!",
    request: req.query,
  });
});

app.get("/api/tasks", async (req: Request, res: Response) => {
  const taskName = req.query.taskName as string;
  const tasksRes: any = await fetchMatchedTask(taskName);
  let taskRecords: Task[] = makeRecord(tasksRes.results);

  let hasMore: boolean = tasksRes.has_more;
  while (hasMore) {
    const nextTasks: any = await fetchNextProps(tasksRes.next_cursor, taskName);
    taskRecords = taskRecords.concat(makeRecord(nextTasks.results));
    hasMore = nextTasks.has_more;
  }
  res.json(taskRecords);
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

const notion = new Client({ auth: process.env.REACT_APP_NOTION_API_KEY });

type FilterQueryType = {
  and: [
    {
      property: string;
      rich_text: {
        [EQUALS_OR_CONTAINS]: string;
      };
    },
    {
      property: string;
      status: {
        equals: string;
      };
    }
  ];
};
type SortQueryType = {
  property: string;
  direction: "ascending" | "descending";
};

const makeFilterQuery = (taskName: string): FilterQueryType => {
  return {
    and: [
      {
        property: TASK_PROPERTY,
        rich_text: {
          [EQUALS_OR_CONTAINS]: taskName,
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
};
const sortQuery: SortQueryType = {
  property: "date",
  direction: "ascending",
};

async function fetchMatchedTask(taskName: string): Promise<any> {
  try {
    const res = await notion.databases.query({
      database_id: DB_ID,
      filter: makeFilterQuery(taskName),
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
      filter: makeFilterQuery(taskName),
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
      // id: result.id,
      date: result.properties.date.date.start,
      sum: result.properties.sum.formula.number,
      // span: result.properties.span.formula.number,
    };
  });
}
