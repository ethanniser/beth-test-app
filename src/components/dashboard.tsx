import { PropsWithChildren } from "beth-stack/jsx";
import { Session } from "lucia";

export function DashBoard({
  children,
  session,
}: PropsWithChildren<{
  session?: Session;
}>) {
  return (
    <div class="flex h-screen w-full flex-col md:flex-row">
      <nav class="flex h-full min-w-[18rem] flex-col bg-gray-800 p-5 text-white lg:w-64">
        <h1 class="mb-4 text-4xl">Dashboard</h1>
        <ul class="flex-grow space-y-6">
          <DashBoardItem text="Home" logo="i-lucide-home" href="/dashboard" />
          <DashBoardItem
            text="Tickets"
            logo="i-lucide-messages-square"
            href="/tickets"
          />
          {session?.user.role === "admin" && (
            <DashBoardItem text="Admin" logo="i-lucide-user" href="/admin" />
          )}
          <DashBoardItem
            text="Settings"
            logo="i-lucide-settings"
            href="/settings"
          />
          <DashBoardItem
            text="Need Help?"
            logo="i-lucide-mail-question"
            href="https://twitter.com/ethanniser"
            newTab
          />
          <DashBoardItem
            text="Logout"
            logo="i-lucide-log-out"
            href="/api/auth/signout"
          />
        </ul>
        <div class="text-2xl font-bold">BETH SAAS</div>
      </nav>
      {children}
    </div>
  );
}

function DashBoardItem({
  text,
  logo,
  href,
  newTab,
}: {
  text: string;
  logo: string;
  href: string;
  newTab?: boolean;
}) {
  return (
    <li>
      <a
        class="flex items-center gap-3 py-2 text-2xl font-light hover:underline"
        href={href}
        target={newTab ? "_blank" : ""}
      >
        <div class={logo} />
        <span>{text}</span>
      </a>
    </li>
  );
}
