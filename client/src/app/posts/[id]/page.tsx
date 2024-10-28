import DetailsPost from "@/modules/posts/post-details/DetailsPost";

type Params = Promise<{ id: string }>;

export default async function DetailsPostPage({ params }: { params: Params }) {
  const { id } = await params;
  return <DetailsPost id={id} />;
}
