"use client";

import React from "react";
import useSWR from "swr";
import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import type { Battle } from "@/types/battle";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BattlesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { data: battles, error, isLoading } = useSWR<Battle[]>("/api/battles", fetcher);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t.battles.title}
      </h1>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-center mb-4">
          {t.battles.loadError}
        </div>
      )}
      {isLoading || !battles ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-right">{t.battles.name}</th>
                <th className="px-4 py-2 border-b text-right">{t.battles.location}</th>
                <th className="px-4 py-2 border-b text-right">{t.battles.hijriYear}</th>
                <th className="px-4 py-2 border-b text-right">{t.battles.nameEn}</th>
                <th className="px-4 py-2 border-b text-right">{t.battles.locationEn}</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(battles) && battles.length > 0 ? (
                battles.map((battle) => (
                  <tr key={battle.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors">
                    <td className="px-4 py-2 border-b font-semibold">{battle.name}</td>
                    <td className="px-4 py-2 border-b">{battle.location || "-"}</td>
                    <td className="px-4 py-2 border-b">{battle.hijri_year ?? "-"}</td>
                    <td className="px-4 py-2 border-b">{battle.nameEn || "-"}</td>
                    <td className="px-4 py-2 border-b">{battle.locationEn || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {t.battles.loadError}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BattlesPage; 