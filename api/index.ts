import express, { Request, Response } from "express";
import { Client } from "@notionhq/client";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Task } from "../src/logic/fetchFETasks";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.REACT_APP_PORT || 4000;
app.use(express.json());
app.use(cors());

app.get("/api", async (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.get("/api/fetasks", async (req: Request, res: Response) => {
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
  console.log(`Server running on PORT ${PORT}`);
});

const notion = new Client({ auth: process.env.REACT_APP_NOTION_API_KEY });
const DB_ID = "b96bcf61cfc247b4881192013a1a970c";

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
  ];
};
type SortQueryType = {
  property: string;
  direction: "ascending" | "descending";
};

const filterQuery: FilterQueryType = {
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
const sortQuery: SortQueryType = {
  property: "date",
  direction: "ascending",
};

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
      // id: result.id,
      date: result.properties.date.date.start,
      sum: result.properties.sum.formula.number,
      // span: result.properties.span.formula.number,
    };
  });
}
