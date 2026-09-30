import type { Metadata } from "next";
import { connection } from "next/server";
import { BoardContent } from "@/components/board/BoardContent";
import { getBoardPageData, parseBoardDate } from "@/lib/api/board";

export const metadata: Metadata = { title: "Daily Board" };

export default async function BoardPage({ searchParams }: PageProps<"/board">) {
  await connection();
  const board = await getBoardPageData(parseBoardDate(await searchParams));

  return <BoardContent key={board.date} board={board} />;
}
