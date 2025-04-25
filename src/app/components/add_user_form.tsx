"use client";

import * as UserAction from "@/server/user";
import { useState } from "react";

function AddUserForm() {
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await UserAction.createUser(newUser);

      setNewUser({ email: "", name: "", password: "" });
    } catch (error) {
      console.error("创建用户失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="email"
          placeholder="邮箱"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-2 border rounded"
          required
          disabled={isSubmitting}
        />
        <input
          type="text"
          placeholder="姓名"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-2 border rounded"
          disabled={isSubmitting}
        />
        <input
          type="password"
          placeholder="密码"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-2 border rounded"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "添加中..." : "添加用户"}
        </button>
      </div>
    </form>
  );
}

export default AddUserForm;
