import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import FileUpload from './fileUpload';
import MemoryEditor from './memoryEditor';
import Preview from './preview';
import Scheduler from './scheduler';
import callApi from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '../common/loadingSpinner';
import { useLocation } from 'react-router-dom';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';


const memorySchema = z.object({
    files: z.array(z.any()).refine(files => files.length > 0 && files.every(file => file instanceof File), {
        message: 'At least one file is required, and all must be files'
    }),
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    tags: z.union([
        z.array(z.string().min(1, { message: "Each tag must have at least one character" })).nonempty({ message: "At least one tag is required" }),
        z.string().transform(tags => tags.split(',').map(tag => tag.trim())).refine(tags => tags.length > 0, { message: "At least one tag is required" })
    ]),
    scheduledDate: z.string().refine(
        (dateStr) => {
            try {
                const userTimezone = moment.tz.guess();
                const selectedDate = moment.tz(dateStr, userTimezone);
                const now = moment().tz(userTimezone);

                return selectedDate.isValid() && selectedDate.isAfter(now);
            } catch {
                return false;
            }
        },
        {
            message: 'Please select a valid future release date'
        }
    )
});



export const CreateDigitalLegacyWrapper = () => {
    const location = useLocation();

    const { memoryId, memoryData } = location.state || { memoryId: null, memoryData: null };

    return <CreateDigitalLegacy memoryId={memoryId} initialMemoryData={memoryData} />;
};


const CreateDigitalLegacy: React.FC<{ memoryId?: string | null; initialMemoryData?: Partial<z.infer<typeof memorySchema>> }> = ({ memoryId = null, initialMemoryData = {} }) => {
    console.log("in legacy ", memoryId, initialMemoryData)
    const isUpdate = memoryId !== null;
    const form = useForm<z.infer<typeof memorySchema>>({
        resolver: zodResolver(memorySchema),
        defaultValues: {
            ...initialMemoryData,
            scheduledDate: initialMemoryData.scheduledDate || '',
            files: initialMemoryData.files || []
        }
    });
    const [loading, setLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const files = form.watch('files') || []; // Now it's an array, default to empty if undefined
    const title = form.watch('title');
    const showPreview = files.length > 0 || !!title; // Show preview if there are files or a title

    console.log("show prev", showPreview)
    const onSubmit = async (data: z.infer<typeof memorySchema>) => {
        try {
            console.log("data is ", data)
            if (!data) return
            setLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description || "");
            formData.append("tags", Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "");
            formData.append("scheduledDate", data.scheduledDate);

            if (!isUpdate) {
                data.files.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("files", file);
                    }
                });
            }

            const endpoint = isUpdate ? `/api/memory/${memoryId}` : "/api/memory";
            const method = isUpdate ? "PUT" : "POST";
            const response = await callApi<{ message: string }>({
                endpoint: endpoint,
                method: method,
                body: formData,
            });

            toast({ title: isUpdate ? "Update successful" : "Digital Capsule Created", description: response.message });
            form.reset();
        } catch (error: any) {
            toast({ title: "Operation Failed", description: error.message || "Something went wrong", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // If it's an update, we might not need to show file upload if no file change is needed
    const showFileUpload = !isUpdate || !initialMemoryData.files || files.length === 0;

    return (
        <div className='flex mt-[88px] min-sm:space-x-8 sm:space-y-8 sm:flex-col max-h-[880px]'>
            <Card className={`w-full max-w-lg mx-auto transition-transform duration-500 ease-in-out ${showPreview ? 'mr-4' : ''} h-full flex flex-col justify-between`}>
                <CardHeader>
                    <CardTitle>{isUpdate ? 'Update' : 'Create'} Legacy Memory</CardTitle>
                </CardHeader>
                <CardContent className=''>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {showFileUpload && (
                                <FormField
                                    control={form.control}
                                    name="files"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload Files</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    onChange={(files) => form.setValue('files', files)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Title of the memory" />
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
                                            <Textarea {...field} placeholder="Describe the memory..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter tags separated by commas" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="scheduledDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Schedule Release</FormLabel>
                                        <FormControl>
                                            <Scheduler
                                                schedule={field}
                                                onChange={(dateStr: string) => { form.setValue('scheduledDate', dateStr); console.log("date is", dateStr) }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" variant={"neutral"} disabled={loading} onClick={() => console.log("submitting ", form.getValues())}>
                                {loading ?
                                    <LoadingSpinner /> :
                                    isUpdate ? 'Update Memory' : 'Create Memory'

                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {showPreview && (
                <div className="w-full min-sm:mx-auto transition-transform duration-500 ease-in-out">
                    <Preview
                        files={files || (initialMemoryData.files as File[])} // Now handling an array of files
                        memoryData={{
                            title: form.watch('title'),
                            description: form.watch('description') ?? '',
                            tags: form.watch('tags') ?? []
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CreateDigitalLegacy;