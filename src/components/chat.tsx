import { format } from "date-fns";
import { db } from "../db/primary";
import { getTenantDb } from "../db/tenant";
import { Chat } from "../db/tenant/schema/chats";

export async function ChatPage({
  organizationId,
  ticketId,
  employeeName,
}: {
  organizationId: number;
  ticketId: number;
  employeeName?: string;
}) {
  const organization = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.id, organizationId),
  });

  if (!organization) {
    return (
      <>
        <h1>An Organization was not found</h1>
        <p>Please config your link is correct</p>
      </>
    );
  }

  const { tenantDb } = getTenantDb({
    dbName: organization.database_name,
    authToken: organization.database_auth_token,
  });

  const ticket = await tenantDb.query.tickets.findFirst({
    where: (tickets, { eq }) => eq(tickets.id, ticketId),
    with: {
      chats: true,
    },
  });

  if (!ticket) {
    return (
      <>
        <h1>A Ticket was not found</h1>
        <p>Please config your link is correct</p>
      </>
    );
  }

  const chats = ticket.chats;

  return (
    <div class="flex h-screen flex-col">
      {/* Chat Header */}
      <div class="border-b border-gray-300 p-4">
        <div class="flex items-center justify-between">
          {/* Left side content */}
          <div>
            <h1 class="flex items-center text-3xl font-bold">
              Subject: {ticket.subject} -
              {ticket.status === "open" ? (
                <span class="ml-2 rounded-full bg-yellow-100 px-3 py-1 text-base font-semibold text-yellow-700">
                  Open
                </span>
              ) : (
                <span class="ml-2 rounded-full bg-green-100 px-3 py-1 text-base font-semibold text-green-700">
                  Closed
                </span>
              )}
            </h1>
            <p class="mt-2 text-base italic text-gray-700">
              {ticket.description}
            </p>
          </div>

          {/* Right side content */}
          <div class="flex flex-col items-end pr-6">
            <div class="text-2xl text-gray-600">
              {organization.name} -{" "}
              {employeeName ? employeeName : "Customer View"}
            </div>
            <a
              href="/login"
              class="mt-2 text-blue-600 hover:text-blue-700 hover:underline"
            >
              Looking for Employee View?
            </a>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        id="chat-messages"
        class="flex-1 overflow-y-auto p-4"
        _="
            on load put my scrollHeight into my scrollTop end
            on mutation put my scrollHeight into my scrollTop end
        "
      >
        {chats.map((chat) => (
          <ChatBubble chat={chat} />
        ))}
        {ticket.status === "closed" && (
          <div class="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            This ticket was closed at{" "}
            {ticket.closed_at
              ? format(ticket.closed_at, "hh:mm aa, MMM dd")
              : ""}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div class="sticky bottom-0 flex w-full items-center gap-3 border-t border-gray-300 bg-white p-4">
        <form
          hx-post="/api/chat"
          hx-target="#chat-messages"
          hx-swap="beforeend"
          hx-swap-5xx="#errorMessage"
          class="flex flex-grow items-center gap-3"
          _="on submit me.reset()"
        >
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            class={`flex-grow rounded-lg border p-2 shadow-inner ${
              ticket.status === "closed" ? "bg-gray-200" : ""
            }`}
            disabled={ticket.status === "closed"}
          />
          <input
            hidden
            type="text"
            value={ticketId.toString()}
            name="ticketId"
          />
          <input
            hidden
            type="text"
            value={organizationId.toString()}
            name="organizationId"
          />
          <button
            class={`rounded-lg p-2 px-5 text-white shadow ${
              ticket.status === "closed" ? "bg-gray-400" : "bg-gray-700"
            }`}
            disabled={ticket.status === "closed"}
            type="submit"
          >
            Send
          </button>
        </form>
        <style>
          {`
          form {
            margin-block-end: 0;
          }
          `}
        </style>
        <button
          hx-post={`/api/ticket/${
            ticket.status === "closed" ? "open" : "close"
          }`}
          hx-vals={`{"ticketId": \"${ticketId}\", "organizationId": \"${organizationId}\"}`}
          class={`rounded-lg p-2 px-5 text-white shadow ${
            ticket.status === "open" ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {ticket.status === "closed" ? "Reopen" : "Close"}
        </button>
        <div id="errorMessage" class="text-red-600"></div>
      </div>
    </div>
  );
}

export function ChatBubble({ chat }: { chat: Chat }) {
  // Formatting the timestamp to a readable string, e.g., "HH:mm, MMM dd"
  const formattedTimestamp = format(chat.timestamp, "hh:mm aa, MMM dd");

  return (
    <div
      class={`flex ${
        chat.sender === "customer" ? "justify-start" : "justify-end"
      } my-2`}
    >
      <div
        class={`rounded-lg px-4 py-2 text-lg shadow ${
          chat.sender === "customer" ? "bg-gray-200" : "bg-gray-700 text-white"
        }`}
      >
        {chat.message}
        <div
          class={`mt-2 text-xs ${
            chat.sender === "customer" ? "text-gray-600" : "text-gray-300"
          }`}
        >
          {formattedTimestamp}
        </div>
      </div>
    </div>
  );
}
