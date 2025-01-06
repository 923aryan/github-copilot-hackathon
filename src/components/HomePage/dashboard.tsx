import { useAuth } from '@/context/authContext';
import Autoplay from 'embla-carousel-autoplay';
import { Bell, Box, Clipboard, Edit, FilePlus, Grid, Plus, Shield, Unlock, User, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { title } from 'process';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    console.log("user is ", user)

    const { toast } = useToast()

    return (
        <div className='space-y-8'>
            <div className='space-y-8 h-full border-border dark:border-darkNavBorder border-4 mt-[88px] bg-white p-4'>
                <div className=''>
                    <div className=' text-4xl font-bold border-b-4 border-dashed border-black inline-block pb-1'>YOUR LEGACY AT A GLANCE</div>
                </div>
                <FeaturesCarousel />
            </div>
            <Button size={"lg"} variant={"neutral"} onClick={() =>
                navigate("/create")
            }>
                <Plus />
                Create your own digital legacy
            </Button>
        </div>
    );
};

const FeaturesCarousel: React.FC = () => {

    const features = [
        {
            icon: <Grid className="h-32 w-32" />,
            title: "Dashboard Overview",
            description:
                "_Step into your digital treasure chest. View all your cherished memories, check the status of scheduled releases, and manage your legacy instructions effortlessly._",
        },
        {
            icon: <FilePlus className="h-32 w-32" />,
            title: "Memory Creation Page",
            description:
                "_Upload photos, videos, and voice notes. Add a heartfelt message, set the perfect release moment, and ensure each memory is a masterpiece._",
        },
        {
            icon: <User className="h-32 w-32" />,
            title: "Profile Management",
            description:
                "_Control every detail of your legacy. Manage privacy settings, choose beneficiaries, and outline your digital will—all in one place._",
        },
        {
            icon: <Edit className="h-32 w-32" />,
            title: "Legacy Letters",
            description:
                "_Write heartfelt letters to your loved ones. Express thoughts, dreams, and wishes to be shared on meaningful dates or milestones._",
        },
        {
            icon: <Box className="h-32 w-32" />,
            title: "Time Capsule",
            description:
                "_Create a digital time capsule filled with memories, messages, and media to be unlocked at a specific moment in time._",
        },
        {
            icon: <Bell className="h-32 w-32" />,
            title: "Notification Center",
            description:
                "_Receive updates on memory statuses, reminders for unfinished creations, and alerts when your memories are accessed._",
        },
        {
            icon: <Shield className="h-32 w-32" />,
            title: "Memorial Mode",
            description:
                "_Honor a life lived by enabling Memorial Mode. Allow loved ones to view memories while keeping the account secure and unchangeable._",
        },
        {
            icon: <Users className="h-32 w-32" />,
            title: "Beneficiary Management",
            description:
                "_Designate trusted individuals to receive your memories, manage your digital assets, and honor your wishes after you’ve passed._",
        },
        {
            icon: <Clipboard className="h-32 w-32" />,
            title: "Digital Will",
            description:
                "_Outline instructions for your digital assets and online presence. Ensure your wishes are clearly defined and honored._",
        },
        {
            icon: <Unlock className="h-32 w-32" />,
            title: "Access Memories",
            description:
                "_Experience memories exactly when they were meant to be shared. Securely access messages, photos, and more with ease._",
        },
    ];

    const plugin = React.useRef(
        Autoplay({ delay: 2500, stopOnInteraction: true })
    )
    return (
        <div className='min-md:px-40'>
            <Carousel className="w-full items-center justify-cente " plugins={[
                plugin.current
            ]} >
                <CarouselContent className='flex '>
                    {features.map((feature, index) => (
                        <CarouselItem key={index}>
                            <div className="p-[20px] ">
                                <Card className="shadow-md rounded-lg">
                                    <CardContent className="flex items-center justify-center p-6 flex-col">
                                        <div>{feature.icon}</div>
                                        <div>
                                            <h3 className="mt-4 text-lg font-heading">{feature.title}</h3>
                                        </div>
                                        <div className='font-base'>
                                            <p className="mt-2 text-sm italic">{feature.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='md:hidden' />
                <CarouselNext className='md:hidden' />
            </Carousel>
        </div>
    );
};

export default FeaturesCarousel;
