import MessageCard from "@/components/MessageCard";

export default function DashboardPage() {
  return (
    <div className="min-h-full w-full py-10 px-32">
      <h1 className="text-4xl sm:text-5xl font-extrabold">Dashboard</h1>

      {/* message card container starts here  */}

      <div className="flex flex-wrap gap-6 p-2 mx-auto">
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
      </div>
      {/* message card container ends here   */}
    </div>
  );
}
