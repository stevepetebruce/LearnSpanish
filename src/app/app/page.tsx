import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function ApPage() {
    return (<Suspense fallback={ <div className="h-screen-header flex items-center justify-center">
            <Loader2Icon className="size-24 animate-spin" />
        </div>}>
        <div>
           Welcome to Learn Spanish!
        </div>
    </Suspense>);
}