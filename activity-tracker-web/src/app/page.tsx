import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/lib/utils/routes";

// proxy.ts normally sends "/" to the user's landing page; this is the fallback.
export default function Home() {
  redirect(APP_ROUTES.BOARD);
}
