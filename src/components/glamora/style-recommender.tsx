"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recommendStyle } from '@/ai/flows/style-recommender';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
  hairDescription: z.string().min(10, {
    message: 'Please describe your hair in a bit more detail.',
  }),
});

export function StyleRecommender() {
  const [recommendation, setRecommendation] = useState<{ styleName: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hairDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendStyle(values);
      setRecommendation(result);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      // You could add a toast notification here to show the user an error.
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="style-recommender" className="py-20 md:py-32 bg-card/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            <Wand2 className="inline-block w-8 h-8 mr-2 text-primary" />
            AI Style Recommender
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Not sure what you're looking for? Describe your hair and let our AI
            stylist suggest the perfect new look for you!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Find Your Next Style</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="hairDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your hair</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'I have long, thick, wavy brown hair. I'm looking for something low-maintenance but stylish.'"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Get Recommendation
                  </Button>
                </form>
              </Form>

              {isLoading && (
                 <div className="mt-6 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-muted-foreground">Our AI is thinking...</p>
                 </div>
              )}

              {recommendation && (
                <Card className="mt-6 bg-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                        <Sparkles/>
                        Your Recommendation: {recommendation.styleName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{recommendation.description}</p>
                    <Button variant="link" className="px-0 mt-2">Book this style now!</Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
