"use client";

import React, { useState, useEffect } from "react";
import { usePromptContext } from "@/context/PromptContext";
import axios from "axios";
import { SquarePen, Trash2, Check, X, Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="inline-block align-middle"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

export default function SuggestedQuestionsPage() {
  const { addPrompt } = usePromptContext();
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const limit = 10;

  const fetchQuestions = async (pageNum = 1, searchValue = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit,
      });
      if (searchValue && searchValue.trim()) {
        params.append("search", searchValue.trim());
      }
      const res = await axios.get(
        `/api/chat/suggested-questions?${params.toString()}`
      );
      setQuestions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (error) {
      alert("Lỗi khi tải danh sách câu hỏi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(page, search);
    // eslint-disable-next-line
  }, [page, search]);

  // Thêm useEffect debounce cho realtime search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Xử lý thêm mới qua modal
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalInput.trim() === "") return;
    setModalLoading(true);
    try {
      await axios.post("/api/chat/suggested-questions", {
        content: modalInput.trim(),
      });
      setModalInput("");
      setModalOpen(false);
      fetchQuestions(1);
      setPage(1);
      toast.success("Đã lưu câu hỏi thành công!");
    } catch (error) {
      toast.error("Lỗi khi lưu câu hỏi đề xuất: " + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    try {
      await axios.delete(`/api/chat/suggested-questions?id=${id}`);
      fetchQuestions(page);
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };

  const handleEdit = (id, content) => {
    setEditId(id);
    setEditContent(content);
  };

  const handleEditSave = async (id) => {
    if (!editContent.trim()) {
      alert("Nội dung không được để trống");
      return;
    }
    try {
      await axios.put("/api/chat/suggested-questions", {
        id,
        content: editContent,
      });
      setEditId(null);
      setEditContent("");
      fetchQuestions(page);
    } catch (error) {
      alert("Lỗi khi cập nhật: " + error.message);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContent("");
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg p-5 col-span-1 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Đề xuất câu hỏi</h1>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Tạo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle>Tạo câu hỏi mới</DialogTitle>
                <DialogDescription>
                  Nhập nội dung câu hỏi đề xuất để người dùng có thể sử dụng.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <textarea
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition min-h-[80px] resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Nhập nội dung câu hỏi đề xuất..."
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  autoFocus
                  disabled={modalLoading}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    disabled={modalLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={modalLoading || !modalInput.trim()}
                  >
                    {modalLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Thanh tìm kiếm */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        {/* Kết quả tìm kiếm */}
        <div className="mb-4 text-sm text-gray-600">
          Hiển thị {questions.length} trong tổng số{" "}
          {questions.length + (totalPages - page) * limit} câu hỏi
          {search && ` (tìm kiếm: "${search}")`}
        </div>
        {success && (
          <div className="mb-4 text-green-600 font-medium">Đã lưu câu hỏi!</div>
        )}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-base">
            <thead>
              <tr className="bg-blue-50 text-gray-700 uppercase text-sm tracking-wider">
                <th className="border-b px-4 py-3 text-center">STT</th>
                <th className="border-b px-10 py-3 text-left w-full">
                  Nội dung
                </th>
                <th className="border-b px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    Đang tải...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    Chưa có câu hỏi nào
                  </td>
                </tr>
              ) : (
                questions.map((q, idx) => (
                  <tr key={q._id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 text-center font-semibold text-gray-600">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-10 py-2 break-words max-w-2xl align-top">
                      {editId === q._id ? (
                        <input
                          className="w-full border rounded p-1 focus:ring-2 focus:ring-blue-400"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleEditSave(q._id);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-gray-800 break-words whitespace-pre-line">
                          {q.content}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center align-top">
                      {editId === q._id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-green-600 hover:text-green-800"
                            title="Lưu"
                            onClick={() => handleEditSave(q._id)}
                          >
                            <Check size={20} />
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            title="Hủy"
                            onClick={handleEditCancel}
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                            onClick={() => handleEdit(q._id, q.content)}
                          >
                            <SquarePen size={20} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                            onClick={() => handleDelete(q._id)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination mới dạng số */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {(page - 1) * limit + questions.length}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">
                    {questions.length + (totalPages - page) * limit}
                  </span>{" "}
                  kết quả
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Trước</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          p === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Sau</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
