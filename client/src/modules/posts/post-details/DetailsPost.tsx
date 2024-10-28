/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/loader/Loader";
import { type PostModel } from "@/schema/PostSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";

export default function DetailsPost({ id }: any) {
  const [item, SetItem] = useState<PostModel | null>(null);
    const fetchData = async () => {
      // base url
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://65.0.204.1:4000";

      axios.defaults.baseURL = baseUrl;
      const { data } = await axios.get(`/api/posts/${id}`);

      SetItem(data.item as PostModel);
      return data;
    };

    const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
      queryKey: ["posts-list", id],
      queryFn: async () => {
        await fetchData();

        return true;
      },
    });

    return (
      <>
        {isLoading || isFetching ? (
          <Loader />
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 p-4 md:p-0 pt-8">
            {isError ? (
              <div className="text-red-600 text-center font-bold">
                {error?.message}
              </div>
            ) : null}

            {item && (
              <>
                {/* Post Header */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {item.title}
                  </h1>

                  {/* Source and Creator Info */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <span className="font-medium text-base text-black">
                          {item.creator}
                        </span>
                        <span>·</span>
                        <span>
                          {format(new Date(item.publishedAt), "MMM d, yyyy")}
                        </span>
                        {item.categories && (
                          <>
                            <span>·</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {item.categories}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <article className="prose prose-lg max-w-none">
                  {/* Main Content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: item.contentSnippet }}
                    className="prose prose-lg prose-slate mx-auto"
                  />
                </article>

                {/* Footer Info */}
                <div className="border-t pt-6 mt-8">
                  <div className="flex justify-between text-sm text-gray-500">
                    <div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        View original article
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                    <div>
                      Last updated:{" "}
                      {format(new Date(item.updatedAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </>
    );
}
