import prisma from "@/prisma/client";
import Pagination from "./components/Pagination";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";

export default async function Home() {
  const open = await prisma.isssue.count({ where: { status: "OPEN" } });
  const closed = await prisma.isssue.count({ where: { status: "CLOSED" } });
  const inProgress = await prisma.isssue.count({
    where: { status: "IN_PROGRESS" },
  });

  return <IssueChart open={open} inProgress={inProgress} closed={closed} />;
}
