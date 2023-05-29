import { getUser } from "@/lib/auth";
import { User } from "lucide-react";
import Image from "next/image";

export function Profile() {
    const { name, avatarUrl } = getUser();
    return (
        <div className="flex items-center gap-3 text-left">
            <Image className="rounded-full h-10 w-10" src={avatarUrl} width={40} height={40} alt="Logged in user avatar" />
            <p className="text-sm leading-snug max-w-[140px]">
                <span className="underline">Olá, {name}</span>
                <a href="" className="block text-red-400 hover:text-red-300">Quero sair</a>
            </p>
        </div>
    )
}