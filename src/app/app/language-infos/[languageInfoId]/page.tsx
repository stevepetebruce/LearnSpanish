import * as React from "react"
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatExperienceLevel } from "@/features/languageInfos/lib/formatters";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { getLanguageInfoTag } from "@/features/languageInfos/dbCache";
import { eq, and } from "drizzle-orm";
import { LanguageInfoTable } from "@/drizzle/schema/languageInfo";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { notFound } from "next/navigation";

const options = [
    {
        label: "Answer Spanish questions",
        description: "Challenge your Spanish skills by answering questions and getting instant feedback on your answers.",
        href: "questions"
    },
    {
        label: "Practice conversations",
        description: "Engage in interactive conversations to improve your speaking and listening skills in Spanish.",
        href: "conversations"
    },
    {
        label: "Refine your Spanish writing",
        description: "Improve your Spanish writing skills through guided exercises and feedback.",
        href: "writing"
    },
     {
        label: "Update language description",
        description: "Only used for minor updates to the language description.",
        href: "edit"
    }
]

export default async function LanguageInfoPage({ params }: { params: Promise<{ languageInfoId: string }> }) {
    const { languageInfoId } = await params;
    const { userId, redirectToSignIn } = await getCurrentUser();  
    if (!userId) {
        return redirectToSignIn();
    }  

    const jobInfo = await getLanguageInfo(languageInfoId, userId);

    if(jobInfo == null) {
        return notFound();
    }
    return (
        <div className="container my-4 space-y-4">
            <BackLink href="/app">Dashboard</BackLink>
            <div className="space-y-6">
                <header className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl">{jobInfo.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary">{formatExperienceLevel(jobInfo.experienceLevel)}</Badge>
                        {jobInfo.title && <Badge variant="secondary">{jobInfo.title}</Badge>}
                        Select an option below to get started:
                    </div>
                        <p className="text-muted-foreground line-clamp-3">{jobInfo.description}</p>
                </header>  

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
                    {options.map((option) => (
                        <Link
                            key={option.href}
                            href={`/app/language-infos/${languageInfoId}/${option.href}`}
                            className="hover:scale-[1.02] transition-[transform_opacity]"
                        >
                            <Card className="h-full flex items-start justify-between flex-row">
                        
                                <CardHeader className="flex-grow">
                                    <CardTitle>{option.label}</CardTitle>
                                    <CardDescription>
                                        {option.description}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent>
                                        <ArrowRightIcon className="size-6" />
                                </CardContent>
                            
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}   
async function getLanguageInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getLanguageInfoTag(id));
    return db.query.LanguageInfoTable.findFirst({
        where: and(eq(LanguageInfoTable.id, id), eq(LanguageInfoTable.userId, userId))  
    })
}
