import callApi from "@/utils/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { LoadingSpinner } from "../common/loadingSpinner";
import { Badge } from "../ui/badge";



interface Memory {
    userInfo: {
        _id: string;
        username: string;
        displayName: string;
        github?: {
            avatarUrl?: string;
        };
    };
    memories: {
        scheduledDate: string;
    }[];
}

const UserCapsule: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [memory, setMemory] = useState<Memory | null>(null);
    const [timeLeft, setTimeLeft] = useState<string[]>([]);

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const response = await callApi<{ data: Memory }>({
                    endpoint: `/utils/searchUser/${userId}`,
                    method: "GET",
                });
                setMemory(response.data);
            } catch (error) {
                console.error('Failed to fetch memory:', error);
            }
        };

        fetchMemory();
    }, [userId]);

    useEffect(() => {
        if (memory) {
            const interval = setInterval(() => {
                const newTimeLeft = memory.memories.map((mem, index) => {
                    const scheduledTime = new Date(mem.scheduledDate).getTime();
                    const now = Date.now();
                    const difference = scheduledTime - now;

                    if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                        return `${days}D : ${hours}H : ${minutes}M : ${seconds}S`;
                    } else {
                        return "Expired";
                    }
                });
                setTimeLeft(newTimeLeft);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [memory]);

    if (!memory) {
        return <div className="mt-[88px] flex w-full justify-center items-center">
            <LoadingSpinner />
        </div>;
    }

    const numberOfMemories = memory.memories.length;

    return (
        <Card className="mt-[88px]">
            <CardHeader>
                <CardTitle>{memory.userInfo.displayName || memory.userInfo.username}</CardTitle>
                <Badge variant="neutral" className="mt-2 p-4 text-lg">{numberOfMemories} Memories</Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                {memory.userInfo.github?.avatarUrl && (
                    <div className="mb-4">
                        <img
                            src={memory.userInfo.github.avatarUrl}
                            alt={memory.userInfo.username}
                            className="w-20 h-20 rounded-full"
                        />
                    </div>
                )}
                {memory.memories.map((mem, index) => (
                    <h1 key={index} className="text-[3.5rem] mb-2 flex flex-row items-start justify-start w-full font-heading space-x-6">
                        <Badge variant={"neutral"} className="text-[3.5rem] space-x-8 w-full">
                            <div>
                                Capsule {index + 1}
                            </div>
                            
                            <div>
                                {timeLeft[index] || "Loading..."}
                            </div>
                        </Badge>

                    </h1>
                ))}
            </CardContent>
        </Card>
    );
}

export default UserCapsule;