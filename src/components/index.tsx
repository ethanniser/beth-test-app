export function FancyLink({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      class="group absolute bottom-3 right-3 flex items-center space-x-2 rounded bg-gray-200 px-3 py-1 text-sm text-gray-600 transition duration-150 ease-in-out hover:bg-gray-300 hover:text-gray-800"
    >
      <span>{text}</span>
      <div class="i-lucide-arrow-up-right transform transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
