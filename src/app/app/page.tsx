import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { desc, eq } from "drizzle-orm";
import { Loader2Icon } from "lucide-react";
import { LanguageInfoTable } from "@/drizzle/schema";
import { Suspense } from "react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLanguageInfoUserTag } from "@/features/languageInfos/dbCache";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageInfoForm } from "@/features/languageInfos/components/LanguageInfoForm";

export default function ApPage() {
    return (<Suspense fallback={ <div className="h-screen-header flex items-center justify-center">
            <Loader2Icon className="size-24 animate-spin" />
        </div>}>
        <LanguageInfos />
    </Suspense>);
}

async function LanguageInfos() {
    const {userId, redirectToSignIn} = await getCurrentUser();
    if(userId === null) redirectToSignIn();

    const languageInfos = await getLanguageInfos(userId);

    if(languageInfos.length === 0) {
        return <NoLanguageInfos />;
    }

    return null;
}

function NoLanguageInfos() {
    return <div className="container my-4 max-w-5xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">Welcome to Spanglish</h1>
        <p className="text-muted-foreground mb-8">To get started, add a new language info to enhance your learning experience!</p>
        <Card>
            <CardContent>
                <LanguageInfoForm />
            </CardContent>
        </Card>
    </div>;
}

async function getLanguageInfos(userId: string) {
    "use cache"
    cacheTag(getLanguageInfoUserTag(userId));

    return db.query.LanguageInfoTable.findMany({
        where: eq(LanguageInfoTable.userId, userId),
        orderBy: desc(LanguageInfoTable.updatedAt),
    });
}