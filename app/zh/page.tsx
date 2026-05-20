import { HomePage } from "@/components/HomePage";
import { getPageMetadata } from "@/lib/site";

export const metadata = getPageMetadata("zh");

export default function ChinesePage() {
  return <HomePage locale="zh" />;
}
