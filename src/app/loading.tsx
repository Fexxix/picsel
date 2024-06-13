import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-4 md:p-6">
      <Loader className="animate-spin" />
    </div>
  );
}
