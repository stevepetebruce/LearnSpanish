import { db } from "@/drizzle/db";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { LanguageInfoTable } from "@/drizzle/schema";
import { Suspense } from "react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLanguageInfoUserTag } from "@/features/languageInfos/dbCache";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageInfoForm } from "@/features/languageInfos/components/LanguageInfoForm";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { formatExperienceLevel } from "@/features/languageInfos/lib/formatters";

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

    return (
        <div className="container my-4">
            <div className="flex gap-2 justify-between mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl">
                Select a language description
                </h1>
                <Button asChild>
                <Link href="/app/language-infos/new">
                    <PlusIcon />
                    Create Language Description
                </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {languageInfos.map((languageInfo) => (
                    <Link
                        key={languageInfo.id}
                        href={`/app/language-infos/${languageInfo.id}`}
                    >
                        <Card className="h-full">
                           <div className="flex items-center justify-between h-full">
                                <div className="space-y-4 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{languageInfo.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground line-clamp-3">
                                        {languageInfo.description}
                                    </CardContent>
                                    
                                <CardFooter className="flex gap-2">
                                    <Badge variant="outline">{formatExperienceLevel(languageInfo.experienceLevel)}</Badge>
                                    {languageInfo.title && (<Badge variant="outline">{languageInfo.title}</Badge>)}
                                </CardFooter>
                                </div>
                                <CardContent>
                                        <ArrowRightIcon className="size-6" />
                                </CardContent>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
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