import Image from "next/image";

type AboutUsCardProps = {
    img: string;
    name: string;
    role: string;
    email: string;
    extraInfo?: React.ReactNode;
};

export default function AboutUsCard({img, name, role, email, extraInfo}: AboutUsCardProps) {
    return (
        <div className="hover-3d">
            <div className="card items-center p-4 w-64">
            <div className="avatar w-48 h-64 rounded-xl overflow-hidden">
                <Image
                src={img}
                alt="Avatar"
                width={1024}
                height={1024}
                />
            </div>
            <h1 className="text-xl font-bold">{name}</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
            <p className="textx-lg font-semibold">{role}</p>
            {extraInfo}
            </div>
        </div>
    )
}