"use client";
import DetailsPost from "@/modules/posts/post-details/DetailsPost";
import React from "react";

export default function DetailsAdminPage({
  params,
}: {
  params: { id: string };
}) {
  return <DetailsPost id={params.id} />;
}
