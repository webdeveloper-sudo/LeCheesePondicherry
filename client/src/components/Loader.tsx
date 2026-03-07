import { Loader } from "lucide-react";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export default function LoaderComponent({
  fullScreen = false,
}: LoaderProps) {
  const content = (
    <div className="flex justify-center items-center py-20">
      <Loader className="animate-spin text-[#FAB519]" size={40} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
