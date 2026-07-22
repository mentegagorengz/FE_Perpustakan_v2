"use client";

import { useState } from "react";
import { useArticles, Article } from "@/hooks/useArticles";

export function useArticlesAdmin(token: string | null) {
  const { articles, isLoading, createArticle, updateArticle, deleteArticle, isProcessing } = useArticles(token);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(false);

  const filteredArticles = articles.filter((a: any) => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormIsPublished(false);
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenEdit = (article: any) => {
    setFormTitle(article.title);
    setFormContent(article.content);
    setFormIsPublished(article.is_published);
    setEditingId(article.id || null);
    setShowForm(true);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", formTitle);
    formData.append("content", formContent);
    formData.append("is_published", String(formIsPublished));

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (editingId) {
      updateArticle({ id: editingId, data: formData }, { onSuccess: resetForm });
    } else {
      createArticle(formData, { onSuccess: resetForm });
    }
  };

  return {
    articles: filteredArticles,
    isLoading,
    isProcessing,
    form: {
      title: formTitle,
      setTitle: setFormTitle,
      content: formContent,
      setContent: setFormContent,
      isPublished: formIsPublished,
      setIsPublished: setFormIsPublished,
      setSelectedFile,
    },
    searchTerm,
    setSearchTerm,
    showForm,
    setShowForm,
    editingId,
    setEditingId,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleOpenEdit,
    handleActionSubmit,
    handleDelete: (id: number) => {
      deleteArticle(id);
      setShowDeleteConfirm(null);
    },
    resetForm,
  };
}
