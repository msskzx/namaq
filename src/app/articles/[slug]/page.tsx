import React from "react";
import ArticleDetails from '@/components/articles/ArticleDetails';

export default function ArticleDetailPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto bg-white dark:bg-gray-950 py-8">
        <ArticleDetails />
      </div>
    </div>
  );
}