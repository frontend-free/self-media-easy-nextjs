import * as UserAction from "@/lib/actions/user";
import AddUserForm from "./components/add_user_form";
import UserCard from "./components/user_card";
import Api from "./components/api";

export default async function Home() {
  const users = await UserAction.getUsers();

  return (
    <main className="container mx-auto p-4">
      <Api />
      <h1 className="text-2xl font-bold mb-4">用户管理系统</h1>

      <AddUserForm />

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
