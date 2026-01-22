import { useUser } from "@/context/UserContext";
import Image from "next/image";
export default function UserProfile() {
  const user = useUser();
  return (
    <>
      <button className="p-1 hover:bg-[--secondary-hover] rounded-full transition-colors">
        <Image
          src={user?.image!}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </button>
    </>
  );
}
