import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import callApi from '@/utils/utils';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');

    // Debounce the search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            onSearch(value);
        }, 300),
        []
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        debouncedSearch(value);
    };

    return (
        <Input
            type="text"
            placeholder="Search Time Capsule..."
            value={query}
            onChange={handleInputChange}
            className="w-full"
        />
    );
};


interface User {
    name: string;
    username: string,
    _id: string,
    github?: {
        avatarUrl?: string;
    }
}

const NavbarSearchButton: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    const handleSearch = async (query: string) => {
        try {
            const users = await callApi<{ data: User[] }>({
                endpoint: `/utils/search?searchQuery=${query}`,
                method: "GET"
            });
            setUsers(users.data);
            console.log("users are ", users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleClick = (userId: string) => {
        setOpen(false)
        navigate(`user-capsule/${userId}`)
    }

    return (
        <Dialog open = {open}>
            <DialogTrigger asChild>
                <Button variant={"neutral"} onClick={() => setOpen(true)} className="relative flex items-center justify-between gap-2 px-5 py-2 h-[44px] pr-20 sm:h-9 sm:w-9 sm:p-0">
                    <div className="lg:hidden">Search Time Capsule...</div>
                    <span className="hidden lg:inline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search h-4 w-4 lg:w-6 lg:h-6 sm:h-4 sm:w-4 shrink-0">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                    </span>
                    <span className="absolute 2xl:hidden text-black border text-base px-1 py-0.5 border-black rounded-base bg-main h-[28px] right-2 top-1.5">
                        ⌘K
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Search Time Capsule</DialogTitle>
                    <DialogDescription>
                        Enter your search query below.
                    </DialogDescription>
                </DialogHeader>
                <SearchBar onSearch={handleSearch} />
                <DialogFooter>
                    <div className="mt-4">
                        {users && users.length > 0 && users.map((user, index) => (
                            <div key={index} onClick={() => handleClick(user._id)} className="flex items-center justify-center py-2 font-heading hover:cursor-pointer hover:scale-105">
                                {user?.github?.avatarUrl && <img src={user.github.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-2" />}
                                <div className="">{user.name}</div>
                            </div>
                        ))}
                        {users.length === 0 && <p className="text-sm text-muted-foreground">No users found.</p>}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Search: React.FC = () => {

    return (
        <div>
            <NavbarSearchButton />
        </div>
    );
};

export default Search;