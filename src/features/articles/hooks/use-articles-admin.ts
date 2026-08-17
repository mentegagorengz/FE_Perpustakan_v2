"use client";

import { useState } from "react";
import { useArticles } from "./use-articles";
import type { ApiArticle, ArticlePayload } from "../types/api";

export function useArticlesAdmin(enabled: boolean) {
  const { articles, isLoading, createArticle, updateArticle, deleteArticle, articleError, isProcessing } = useArticles(enabled);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(false);

  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormIsPublished(false);
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOpenEdit = (article: ApiArticle) => {
    setFormTitle(article.title);
    setFormContent(article.content);
    setFormIsPublished(article.is_published);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ArticlePayload = {
      title: formTitle,
      content: formContent,
      image_url: selectedFile ? selectedFile.name : undefined,
      is_published: formIsPublished,
    };

    if (editingId) {
      updateArticle({ id: editingId, payload }, { onSuccess: resetForm });
    } else {
      createArticle(payload, { onSuccess: resetForm });
    }
  };

  return {
    articles: filteredArticles,
    isLoading,
    isProcessing,
    articleError,
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
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleOpenEdit,
    handleActionSubmit,
    handleDelete: (id: number) => {
      deleteArticle(id, { onSuccess: () => setShowDeleteConfirm(null) });
    },
    resetForm,
  };
}
