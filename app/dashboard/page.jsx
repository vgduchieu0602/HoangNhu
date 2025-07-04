import connectDB from "@/config/db";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Image from "next/image";
import UserList from "@/components/dashboard/UserList";

export default async function DashboardPage() {
  await connectDB();
  const totalUsers = await User.countDocuments();

  // Get all chats and count total messages
  const chats = await Chat.find({});
  const totalMessages = chats.reduce(
    (acc, chat) => acc + chat.messages.length,
    0
  );

  // Get all users with their chat statistics
  const users = await User.find({});
  const userStats = await Promise.all(
    users.map(async (user) => {
      const userChats = chats.filter((chat) => chat.userId === user._id);
      const messageCount = userChats.reduce(
        (acc, chat) => acc + chat.messages.length,
        0
      );
      return {
        ...user.toObject(),
        chatCount: userChats.length,
        messageCount,
      };
    })
  );

  // Log statistics for debugging
  const totalUserChats = userStats.reduce(
    (acc, user) => acc + user.chatCount,
    0
  );
  const totalUserMessages = userStats.reduce(
    (acc, user) => acc + user.messageCount,
    0
  );
  console.log("Debug Statistics:", {
    totalChats: chats.length,
    totalUserChats,
    totalMessages,
    totalUserMessages,
    orphanedChats: chats.length - totalUserChats,
    orphanedMessages: totalMessages - totalUserMessages,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng người dùng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card 2 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số tin nhắn
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card 3 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số hội thoại
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {chats.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">
          Danh sách người dùng
        </h2>
        <UserList users={userStats} />
      </div>
    </div>
  );
}
