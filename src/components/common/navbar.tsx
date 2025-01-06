// src/components/Navbar.tsx
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import time from "../../assets/time-left-svgrepo-com.svg"
import { Card, CardContent } from "../ui/card";
import { useAuth } from "@/context/authContext";
import { User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Search from "./search";

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {


        logout();
        navigate('/');
    };

    return (
        <nav className="fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 sm:h-16 ">
            <div className="mx-auto flex w-[1300px] dark:text-darkText text-text max-w-full items-center justify-between">
                <div className="hidden w-[236px] lg:block md:w-[108px] xs:w-9">
                    <Button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:Rhla:" data-state="closed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" className="lucide lucide-menu h-6 w-6 sm:h-4 sm:w-4"><line x1="4" x2="20" y1="12" y2="12">
                            </line>
                            <line x1="4" x2="20" y1="6" y2="6"></line>
                            <line x1="4" x2="20" y1="18" y2="18"></line>
                        </svg>
                    </Button>
                </div>
                <div className="flex items-center gap-10">
                    <Link className="text-[30px] h-11 w-11 rounded-base flex text-text  sm:w-9 sm:h-9 sm:text-[22px] items-center justify-center font-heading" to="/">
                        <img src={time} alt="Time Icon" className="h-full w-full" />
                    </Link>
                    <div className="flex items-center gap-10 2xl:gap-8 lg:hidden">
                        <Link className="text-xl 2xl:text-base font-base" to="/docs">Dashboard</Link>
                        <Link className="text-xl 2xl:text-base font-base" to="/memories">Memories</Link>
                        {!isAuthenticated && <Link className="text-xl 2xl:text-base font-base" to="/login">Login</Link>}
                        <Link className="text-xl 2xl:text-base font-base" to="/showcase">Showcase</Link>
                    </div>
                </div>
                <div className="flex items-center gap-5 xl:gap-5">
                    <Search />

                    <div className="flex items-center justify-end gap-5 md:w-[unset] xs:gap-3">
                        <a target="_blank" href="https://github.com/923aryan/github-copilot-hackathon"
                            className="md:hidden flex gap-2 items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
                            <svg className="h-6 w-6 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                <path className="fill-text dark:fill-darkText" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z">
                                </path>
                            </svg>
                        </a>
                        <a target="_blank" href="https://x.com/AryanTh99" className="md:hidden flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
                            <svg
                                className="h-6 w-6 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path className="fill-text dark:fill-darkText" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                            </svg>
                        </a>
                    </div >
                    {isAuthenticated &&
                        <div className="max-w-48">
                            <Popover>
                                <PopoverTrigger asChild className="cursor-pointer">
                                    {user?.github?.avatarUrl ? (
                                        <img
                                            height={"24"}
                                            width={"48"}
                                            className=" rounded-base"
                                            src={user.github.avatarUrl}
                                            alt="User Avatar"
                                        />
                                    ) : (
                                        <User className="h-6 w-6 sm:h-4 sm:w-4" />
                                    )}
                                </PopoverTrigger>
                                <PopoverContent className="max-w-sm">
                                    <div className="grid gap-4 cursor-pointer" onClick={handleLogout}>
                                        Logout
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;