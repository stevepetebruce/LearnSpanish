"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { experienceLevels, LanguageInfoTable } from "@/drizzle/schema/languageInfo";
import { formatExperienceLevel } from "../lib/formatters";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { languageInfoSchema } from "../schemas";
import { createLanguageInfo, updateLanguageInfo } from "../actions";
import { toast } from "sonner";

type LanguageInfoFormData = z.infer<typeof languageInfoSchema>;


export function LanguageInfoForm({
  languageInfo,
}: {
  languageInfo?: Pick<
    typeof LanguageInfoTable.$inferSelect,
    "id" | "name" | "title" | "description" | "experienceLevel"
  >
}) {
  const form = useForm<LanguageInfoFormData>({
    resolver: zodResolver(languageInfoSchema),
    defaultValues: languageInfo ?? {
      name: "",
      title: null,
      experienceLevel: "beginner",
      description: "",
    },
  });

  async function onSubmit(values: LanguageInfoFormData) {
    const action = languageInfo ? updateLanguageInfo.bind(null, languageInfo.id) : createLanguageInfo;
    const res = await action(values);

    if(res?.error) {
      toast.error(res.message);
      // Handle error (e.g., show a notification)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spanish" {...field} />
              </FormControl>
              <FormDescription>Displayed in the UI for easy identification</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Learning Spanish"  value={field.value ?? ""} onChange={e => field.onChange(e.target.value || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {formatExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your learning goals or experience..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Be as descriptive as possible. The more detail you provide, the better we can tailor your learning experience.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            <LoadingSwap isLoading={form.formState.isSubmitting} >
                Save Language Information
            </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}