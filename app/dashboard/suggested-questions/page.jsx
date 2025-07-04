"use client";

import React, { useState, useEffect } from "react";
import { usePromptContext } from "@/context/PromptContext";
import axios from "axios";
import { SquarePen, Trash2, Check, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

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
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
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
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow transition"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon />
            <span>Tạo</span>
          </button>
        </div>
        {/* Thanh tìm kiếm */}
        <form
          className="mb-4 flex items-center gap-2 max-w-md"
          onSubmit={(e) => e.preventDefault()} // Không làm gì khi submit
        >
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
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
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-50 hover:bg-gray-100"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Trước
          </button>
          <span className="font-medium text-gray-700">
            Trang {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-50 hover:bg-gray-100"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Sau
          </button>
        </div>
        {/* Modal thêm mới */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn border border-blue-100">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold transition-colors"
                onClick={() => setShowModal(false)}
                aria-label="Đóng"
              >
                <span aria-hidden>×</span>
              </button>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                  <PlusIcon />
                </span>
                <h2 className="text-xl font-bold text-gray-800">
                  Tạo câu hỏi mới
                </h2>
              </div>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <textarea
                  className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition min-h-[80px] resize-none text-gray-800 bg-blue-50 placeholder-gray-400"
                  rows={3}
                  placeholder="Nhập nội dung câu hỏi đề xuất..."
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  autoFocus
                  disabled={modalLoading}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-60"
                    onClick={() => setShowModal(false)}
                    disabled={modalLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
                    disabled={modalLoading || !modalInput.trim()}
                  >
                    {modalLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                    ) : (
                      <PlusIcon />
                    )}
                    {modalLoading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
