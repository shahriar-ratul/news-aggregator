"use client";
import { Button } from "@/components/ui/button";
import { type PostModel } from "@/schema/PostSchema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import React from "react";

import { MultiSelect } from "@/components/ui/multi-select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { SourceModel } from "@/schema/SourceSchema";
import { Alert } from "@/components/ui/alert";
import { SkeletonCard } from "@/components/loader/SkeletonCard";

export default function PostTable() {
  const [posts, setPosts] = useState<PostModel[]>([]);

  const [sources, setSources] = useState<SourceModel[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [searchKey] = useDebounce(search, 500);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(0);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
  };

  const handleSourcesChange = (value: string[]) => {
    console.log("value", value);
    setSelectedSources(value);
  };

  const getSources = async () => {
    const { data } = await axios.get("/api/feeds/all-sources");
    setSources(data);
  };

  const fetchData = async (
    page: number,
    limit: number,
    search: string,
    sources: string[] | undefined
  ) => {
    const adjustedPage = page === 0 ? 1 : page;

    // base url
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://65.0.204.1:4000";

    axios.defaults.baseURL = baseUrl;

    const sourceQuery = sources ? `&source=${JSON.stringify(sources)}` : "";

    const { data } = await axios.get(
      `/api/posts?page=${adjustedPage}&limit=${limit}&search=${search}${sourceQuery}`
    );

    return data;
  };

  const { isLoading, isError, error, isFetching, refetch } = useQuery<
    boolean,
    unknown
  >({
    queryKey: ["posts-list", searchKey, selectedSources],
    queryFn: async () => {
      const data = await fetchData(page, limit, searchKey, selectedSources);

      console.log("data", data);

      setPosts(data.items);
      setPageCount(data.meta.pageCount);
      setLimit(data.meta.limit);
      setPage(data.meta.page);

      return true;
    },
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    getSources();
  }, []);

  return (
    <div className="space-y-4 w-full">
      {/* Search Controls */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <MultiSelect
          options={sources.map((source) => ({
            label: source.title,
            value: source.id.toString(),
          }))}
          onValueChange={handleSourcesChange}
          defaultValue={selectedSources}
          placeholder="Select Sources"
          variant="inverted"
          animation={0}
          maxCount={3}
        />
      </div>

      {isError && (
        <Alert variant="destructive">{(error as Error).message}</Alert>
      )}

      {(isLoading || isFetching) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </>
      )}

      {!isLoading && !isFetching && (
        <>
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {posts.map((post, index) => (
              <Link
                href={`/posts/${post.id}`}
                key={index}
                className="block w-full"
              >
                <Card className="h-full w-full bg-card hover:bg-accent/5 transition-all duration-200 cursor-pointer border-border/40">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {Math.ceil(post.contentSnippet.length / 200)} min read
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.contentSnippet.length > 100
                        ? `${post.contentSnippet
                            .slice(0, 100)
                            .split(" ")
                            .slice(0, -1)
                            .join(" ")}...`
                        : post.contentSnippet}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {post.categories ? (
                          <div className="flex flex-wrap gap-1">
                            {JSON.parse(post.categories).map(
                              (category: string, idx: number) => (
                                <Badge key={idx} variant="secondary">
                                  {category}
                                </Badge>
                              )
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Button className="btn-black">View</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            previousLabel="< Previous"
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName="flex items-center justify-center gap-2 mt-8"
            pageClassName="inline-flex items-center justify-center w-8 h-8 border rounded hover:bg-accent"
            pageLinkClassName="inline-flex items-center justify-center w-full h-full"
            previousClassName="inline-flex items-center justify-center px-4 h-8 border rounded hover:bg-accent"
            nextClassName="inline-flex items-center justify-center px-4 h-8 border rounded hover:bg-accent"
            breakClassName="inline-flex items-center justify-center w-8 h-8"
            activeClassName="bg-primary text-primary-foreground"
            disabledClassName="opacity-50 cursor-not-allowed"
          />

          {/* Optional: Show total results */}
          <div className="text-center text-sm text-muted-foreground">
            {pageCount > 0 ? (
              <>
                Showing {page * limit + 1} to{" "}
                {Math.min((page + 1) * limit, pageCount * limit)} of{" "}
                {pageCount * limit} results
              </>
            ) : (
              "No results found"
            )}
          </div>
        </>
      )}
    </div>
  );
}
