import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <p>Not found Page</p>
      <p>
        Go to <Link href="/">Home</Link>
      </p>
    </div>
  );
}
