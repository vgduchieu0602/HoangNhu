"use client";

import React, { useState, useEffect } from "react";
import { usePromptContext } from "@/context/PromptContext";
import axios from "axios";

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
      setSuccess(true);
      fetchQuestions(1);
      setPage(1);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      alert("Lỗi khi lưu câu hỏi đề xuất: " + error.message);
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

  // Xử lý tìm kiếm khi submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
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
        onSubmit={handleSearchSubmit}
        className="mb-4 flex items-center gap-2 max-w-md"
      >
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tìm
        </button>
      </form>
      {success && (
        <div className="mb-4 text-green-600 font-medium">Đã lưu câu hỏi!</div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-base">
          <thead>
            <tr className="bg-blue-50 text-gray-700 uppercase text-sm tracking-wider">
              <th className="border-b px-4 py-3 text-center">STT</th>
              <th className="border-b px-4 py-3 text-left">Nội dung</th>
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
                  <td className="px-4 py-2">
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
                      <span className="text-gray-800">{q.content}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editId === q._id ? (
                      <>
                        <button
                          className="text-green-600 hover:underline font-medium mr-2"
                          onClick={() => handleEditSave(q._id)}
                        >
                          Lưu
                        </button>
                        <button
                          className="text-gray-500 hover:underline font-medium"
                          onClick={handleEditCancel}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600 hover:underline font-medium mr-2"
                          onClick={() => handleEdit(q._id, q.content)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:underline font-medium"
                          onClick={() => handleDelete(q._id)}
                        >
                          Xóa
                        </button>
                      </>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Tạo câu hỏi mới
            </h2>
            <form onSubmit={handleModalSubmit}>
              <textarea
                className="w-full border rounded p-2 mb-4 focus:ring-2 focus:ring-blue-400"
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
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setShowModal(false)}
                  disabled={modalLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  disabled={modalLoading || !modalInput.trim()}
                >
                  {modalLoading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
