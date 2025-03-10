import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <p>Not found Page</p>
      <p>
        Go to <Link href="/main/">Main</Link>
      </p>
    </div>
  );
}
