"use client";

import { User } from "@/generated/prisma";
import { deleteUser } from "@/lib/actions/user";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <p className="font-bold">{user.name || "未命名"}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <button
        onClick={async () => {
          await deleteUser(user.id);
          // window.location.reload();
        }}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        删除
      </button>
    </div>
  );
}
