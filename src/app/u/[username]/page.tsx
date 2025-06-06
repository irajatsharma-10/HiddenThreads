'use client';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios  from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestButtonLoading, setIsSuggestButtonLoading] = useState(false);
  const { toast } = useToast();
  const [text, setText] = useState('');

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const watchContent = form.watch('content');

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const params = useParams<{ username: string }>();
  const specialChar = '||';

  const StringSplit = (sentence: string): string[] => {
    return sentence.split(specialChar);
  };

  async function onMessageSubmit(data: z.infer<typeof messageSchema>) {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/send-message', {
        username: params.username,
        content: data.content,
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
      }

      form.setValue('content', '');
    } catch (error: unknown) {
      console.log(error);
      if(error instanceof Error){
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      toast({
        title: 'Error',
        description: "Unexpected Error occured",
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false);
    }
  }

  function handleTextMessage(data: string) {
    form.setValue('content', data);
  }

  async function onSuggestMessage() {
    setIsSuggestButtonLoading(true);
    try {
      const result = await axios.post('/api/suggest-messages');
      const response = result.data.message.candidates[0].content.parts[0].text;
      setText(response);
      return response;
    } catch (error: unknown) {
      if(error instanceof Error){
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      toast({
        title: 'Error',
        description: "Unexpected Error occured",
        variant: 'destructive'
      })
    } finally {
      setIsSuggestButtonLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 rounded max-w-4xl bg-white dark:bg-gradient-to-r from-slate-900 to-slate-700 ">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onMessageSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !watchContent}>
              Send It
            </Button>
          )}
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            className="my-4"
            onClick={onSuggestMessage}
            disabled={isSuggestButtonLoading}
          >
            {isSuggestButtonLoading ? `Loading...` : `Suggest Message`}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader className="font-bold">Messages</CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {/* Update the Button styling */}
            {text === ''
              ? StringSplit(initialMessageString).map((data, index) => (
                <Button
                  className="border bg-gray-200 text-black hover:bg-gray-300"
                  key={index}
                  onClick={() => handleTextMessage(data)}
                >
                  {data}
                </Button>
              ))
              : StringSplit(text).map((data, index) => (
                <Button
                  className="border bg-gray-200 text-black hover:bg-gray-300"
                  key={index}
                  onClick={() => handleTextMessage(data)}
                >
                  {data}
                </Button>
              ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;