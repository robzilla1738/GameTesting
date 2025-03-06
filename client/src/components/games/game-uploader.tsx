import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertGameSchema } from "@shared/schema";
import type { InsertGame } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function GameUploader() {
  const { toast } = useToast();
  const form = useForm<InsertGame>({
    resolver: zodResolver(insertGameSchema),
    defaultValues: {
      title: "",
      description: "",
      version: "1.0.0",
      gameUrl: "",
      published: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InsertGame) => {
      const res = await apiRequest("POST", "/api/games", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Game uploaded successfully",
        description: "Your game is now available to play",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Failed to upload game",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gameUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
              <FormDescription>
                URL to your game's HTML file
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload Game"}
        </Button>
      </form>
    </Form>
  );
}
