import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">探索活動</h1>
      <div className="text-gray-500">熱門活動列表</div>
      <Link href="/events/1">活動1</Link>
      <Link href="/events/2">活動2</Link>
      <Link href="/events/3">活動3</Link>
    </main>
  );
}
