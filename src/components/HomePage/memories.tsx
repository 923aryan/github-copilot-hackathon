import { useToast } from '@/hooks/use-toast';
import callApi from '@/utils/utils';
import { PencilIcon, TrashIcon } from 'lucide-react'; // For icons
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../common/loadingSpinner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';


// Assuming you have these types defined elsewhere or need to define them:
interface Memory {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    scheduledDate: string;
    files: {
        name: string;
        type: string;
        size: number;
        url: string;
    }[];
}

export default function Memories({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const navigate = useNavigate();
    const [memories, setMemories] = useState<Memory[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast()
    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const response = await callApi<{ data: Memory[] }>({
                    endpoint: "/api/memory/all",
                    method: "GET"
                });
                setMemories(response.data);
            } catch (err: any) {
                setError("Failed to load memories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, []);

    const GetMemory = async (memoryId: string) => {
        try {
            setIsLoading(true);

            // First, get the memory metadata
            const memory = await callApi<Memory>({
                endpoint: `/api/memory/${memoryId}`, // The `/api` prefix is already handled in `callApi`
                method: "GET"
            });

            // setMemoryData(memory);

            // Then, fetch each file's content using callApi
            const fileContents = await Promise.all(
                memory.files.map(async (file, index) => {
                    // Use callApi instead of fetch
                    const blob = await callApi<Blob>({
                        endpoint: `/api/memory/${memoryId}/file/${index}`,
                        method: "GET",
                        headers: {
                            Accept: file.type
                        },
                    });

                    // Directly convert Blob to File
                    return new File([blob], file.name, { type: file.type });
                })
            );

            // Now fileContents is an array of File objects, which can be directly used in your form setup


            // setMemoryFiles(fileContents);

            // navigate('/preview', { state: { files: fileContents, memoryData: memory } });

            navigate('/update/memory', {
                state: {
                    memoryId: memoryId,
                    memoryData: {
                        ...memory,
                        files: fileContents,
                    },
                },
            });


        } catch (err: any) {
            toast({
                title: "Error",
                description: "Failed to get memory",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteMemory = async (memoryId: string) => {
        try {
            setIsLoading(true)

            await callApi({
                endpoint: `/api/memory/${memoryId}`,
                method: "DELETE"
            });
            if (memories)
                setMemories(memories.filter(memory => memory._id !== memoryId));
            toast({ title: "Memory deleted successfully" });
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to delete memory", variant: "destructive" });
        } finally {
            setIsLoading(false)

        }
    };

    return (
        <div className={`flex flex-col gap-6 items-center justify-center mt-[88px] ${className}`} {...props}>
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Your Memories</CardTitle>
                </CardHeader>
                <CardContent>
                    {!isLoading ?
                        memories !== null && memories.length > 0 ? (
                            memories.map((memory) => (
                                <div key={memory._id} className="mb-4 border-2 border-white border-dashed p-6 cursor-pointer hover:scale-105" >
                                    <div className="flex justify-between items-start">
                                        <div className='flex flex-col items-start'>
                                            <h3 className="text-lg font-semibold">Title: {memory.title}</h3>
                                            {memory.description && <p className="text-sm text-muted-foreground">Description: {memory.description}</p>}
                                            <div className="flex flex-wrap mt-2 space-x-2">
                                                {memory.tags &&
                                                    <div>
                                                        tags:
                                                    </div>
                                                    &&
                                                    memory.tags.map((tag, index) => (
                                                        <Badge variant={"neutral"} key={index}>
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                variant="neutral"
                                                onClick={() => GetMemory(memory._id)}
                                            >
                                                <PencilIcon className="mr-2 h-4 w-4" /> Update
                                            </Button>
                                            <Button
                                                variant="default"
                                                onClick={() => handleDeleteMemory(memory._id)}
                                            >
                                                <TrashIcon className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No memories found.</p>
                        )
                        :
                        <div className="h-[24px] flex justify-center items-center w-full">
                            { <LoadingSpinner />}
                        </div>

                    }
                </CardContent>
            </Card>
        </div >
    );
}
