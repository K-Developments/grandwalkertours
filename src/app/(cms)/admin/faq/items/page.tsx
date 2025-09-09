// src/app/(cms)/admin/faq/items/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getFaqItems, addFaqItem, deleteFaqItem, updateFaqItem } from '@/lib/firebase/admin-firestore';
import type { FAQItem } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqFormSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long.'),
  answer: z.string().min(10, 'Answer must be at least 10 characters long.'),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

export default function FaqItemsAdminPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const { toast } = useToast();

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getFaqItems((data) => {
      setFaqItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
    } else {
      form.reset({
        question: '',
        answer: '',
      });
    }
  }, [editingItem, form]);

  const onSubmit = async (data: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        await updateFaqItem(editingItem.id, data);
        toast({ title: 'Success', description: 'FAQ item updated successfully.' });
      } else {
        await addFaqItem(data);
        toast({ title: 'Success', description: 'New FAQ item added.' });
      }
      form.reset();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving FAQ item:', error);
      toast({ title: 'Error', description: 'Failed to save FAQ item.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      await deleteFaqItem(id);
      toast({ title: 'Success', description: 'FAQ item deleted.' });
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      toast({ title: 'Error', description: 'Failed to delete FAQ item.', variant: 'destructive' });
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingItem ? 'Edit FAQ Item' : 'Add New FAQ Item'}</CardTitle>
          <CardDescription>{editingItem ? 'Modify the details for this question and answer.' : 'Add a new question and answer to the FAQ page.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingItem ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingItem ? 'Update FAQ' : 'Add FAQ'}
                    </>
                  )}
                </Button>
                {editingItem && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">Current FAQ Items</CardTitle>
          <CardDescription>Manage the existing questions and answers.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : faqItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No FAQ items found. Add one using the form above.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem value={item.id!} key={item.id}>
                    <div className="flex items-center justify-between w-full">
                        <AccordionTrigger className="flex-1 text-left">{item.question}</AccordionTrigger>
                        <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit FAQ</span>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id!)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete FAQ</span>
                            </Button>
                        </div>
                    </div>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
