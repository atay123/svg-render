import { HomePage } from "@/components/HomePage";
import { getPageMetadata } from "@/lib/site";

export const metadata = getPageMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
