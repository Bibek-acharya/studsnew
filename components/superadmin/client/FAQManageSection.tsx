"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  id: number;
  category_id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: number;
  name: string;
  description: string;
  items: FAQItem[];
}

export default function FAQManageSection() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [editingCat, setEditingCat] = useState<{
    id?: number;
    name: string;
    description: string;
  } | null>(null);
  const [editingItem, setEditingItem] = useState<{
    id?: number;
    category_id: number;
    question: string;
    answer: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiService.getFAQCategories();
      setCategories(res.data || []);
    } catch {
      showToast("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveCategory = async () => {
    if (!editingCat || !editingCat.name.trim()) return;
    setSaving(true);
    try {
      if (editingCat.id) {
        await apiService.updateFAQCategory(editingCat.id, {
          name: editingCat.name,
          description: editingCat.description,
        });
      } else {
        await apiService.createFAQCategory({
          name: editingCat.name,
          description: editingCat.description,
        });
      }
      setEditingCat(null);
      showToast("Category saved");
      fetchData();
    } catch {
      showToast("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Delete this category and all its FAQs?")) return;
    try {
      await apiService.deleteFAQCategory(id);
      showToast("Category deleted");
      fetchData();
    } catch {
      showToast("Failed to delete category");
    }
  };

  const saveItem = async () => {
    if (
      !editingItem ||
      !editingItem.question.trim() ||
      !editingItem.answer.trim()
    )
      return;
    setSaving(true);
    try {
      if (editingItem.id) {
        await apiService.updateFAQItem(editingItem.id, {
          question: editingItem.question,
          answer: editingItem.answer,
        });
      } else {
        await apiService.createFAQItem({
          category_id: editingItem.category_id,
          question: editingItem.question,
          answer: editingItem.answer,
        });
      }
      setEditingItem(null);
      showToast("FAQ saved");
      fetchData();
    } catch {
      showToast("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await apiService.deleteFAQItem(id);
      showToast("FAQ deleted");
      fetchData();
    } catch {
      showToast("Failed to delete FAQ");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">FAQ Management</h2>
          <p className="text-sm text-gray-500">
            Create and manage FAQ categories and questions.
          </p>
        </div>
        <button
          onClick={() => setEditingCat({ name: "", description: "" })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* Category Form Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">
              {editingCat.id ? "Edit Category" : "New Category"}
            </h3>
            <input
              value={editingCat.name}
              onChange={(e) =>
                setEditingCat({ ...editingCat, name: e.target.value })
              }
              placeholder="Category name"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            <textarea
              value={editingCat.description}
              onChange={(e) =>
                setEditingCat({ ...editingCat, description: e.target.value })
              }
              placeholder="Description (optional)"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              rows={2}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingCat(null)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={saving || !editingCat.name.trim()}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Form Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold">
              {editingItem.id ? "Edit FAQ" : "New FAQ"}
            </h3>
            <input
              value={editingItem.question}
              onChange={(e) =>
                setEditingItem({ ...editingItem, question: e.target.value })
              }
              placeholder="Question"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            <textarea
              value={editingItem.answer}
              onChange={(e) =>
                setEditingItem({ ...editingItem, answer: e.target.value })
              }
              placeholder="Answer"
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                disabled={
                  saving ||
                  !editingItem.question.trim() ||
                  !editingItem.answer.trim()
                }
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium">No FAQ categories yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-md border border-gray-200 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedCat(expandedCat === cat.id ? null : cat.id)
                }
              >
                <div className="flex items-center gap-3">
                  {expandedCat === cat.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">
                      {cat.items.length} items · {cat.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCat({
                        id: cat.id,
                        name: cat.name,
                        description: cat.description,
                      });
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(cat.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem({
                        category_id: cat.id,
                        question: "",
                        answer: "",
                      });
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedCat === cat.id && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {cat.items.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400 text-center">
                      No FAQs in this category
                    </p>
                  ) : (
                    cat.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-4 hover:bg-gray-50/50"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-medium text-gray-900 text-sm">
                            {item.question}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {item.answer}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() =>
                              setEditingItem({
                                id: item.id,
                                category_id: cat.id,
                                question: item.question,
                                answer: item.answer,
                              })
                            }
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-md bg-green-600 px-5 py-4 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
