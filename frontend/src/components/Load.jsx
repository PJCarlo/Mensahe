import { Loader } from "lucide-react";

const Load = () => {
  return (
    <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
  )
}

export default Load
