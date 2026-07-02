"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MagnifyingGlass,
  Eye,
  Pencil,
  Trash,
  Spinner,
  CaretLeft,
  CaretRight,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  institutionBlogsApi,
  InstitutionBlog,
} from "@/services/institutionBlogsApi";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=400";

const BlogDirectoryPage: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<InstitutionBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blogId: number | null;
    title: string;
  }>({
    isOpen: false,
    blogId: null,
    title: "",
  });
  const limit = 10;

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await institutionBlogsApi.list(page, limit);
        setBlogs(res.blogs || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setBlogs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [page]);

  const filtered = useMemo(() => {
    if (!search) return blogs;
    return blogs.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [blogs, search]);

  const handleDelete = useCallback(
    (id: number) => {
      const target = blogs.find((blog) => blog.id === id);
      setDeleteModal({
        isOpen: true,
        blogId: id,
        title: target?.title || "this blog",
      });
    },
    [blogs],
  );

  const confirmDeleteBlog = useCallback(async () => {
    if (!deleteModal.blogId) return;
    const blogId = deleteModal.blogId;
    setDeleteModal({ isOpen: false, blogId: null, title: "" });
    try {
      await institutionBlogsApi.delete(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      toast.success("Blog deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    }
  }, [deleteModal.blogId]);

  const totalPages = Math.ceil(total / limit);

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Blog Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Blogs" },
        ]}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() =>
              setDeleteModal({ isOpen: false, blogId: null, title: "" })
            }
          />
          <div className="relative mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <button
              onClick={() =>
                setDeleteModal({ isOpen: false, blogId: null, title: "" })
              }
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Delete Blog
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, blogId: null, title: "" })
                }
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlog}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <button
              onClick={() =>
                router.push("/institution-zone/dashboard/blogs/create")
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              Create Blog
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500">Loading blogs...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">
                      Published
                    </th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-gray-500"
                      >
                        {search
                          ? "No blogs found matching your search."
                          : "No blogs yet. Create your first blog!"}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <img
                            src={blog.image || FALLBACK_IMAGE}
                            alt={blog.title}
                            className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-6">
                          <p className="font-medium text-gray-900">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {stripHtml(blog.content || "").slice(0, 60)}
                          </p>
                        </td>
                        <td className="text-center py-3 px-6 text-gray-500">
                          {blog.created_at
                            ? new Date(blog.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </td>
                        <td className="text-center py-3 px-6">
                          {blog.status === "published" ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              Published
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="text-center py-3 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/institution-zone/dashboard/blogs/create?edit=${blog.id}`,
                                )
                              }
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="p-1.5 hover:bg-red-50 rounded text-red-600"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> blogs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                        page === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-gray-400">...</span>}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDirectoryPage;
