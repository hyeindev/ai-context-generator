"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { CategoryItem } from "@/types";
import CategoryIcon from "./CategoryIcon";

interface CategorySelectorProps {
  categories: CategoryItem[];
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onSelectionChange,
}: CategorySelectorProps) {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onSelectionChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onSelectionChange([...selectedCategories, categoryId]);
    }
  };

  const selectRecommended = () => {
    const recommended = categories.filter((c) => c.recommended).map((c) => c.id);
    onSelectionChange(recommended);
  };

  const selectAll = () => {
    onSelectionChange(categories.map((c) => c.id));
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">추가 설정할 항목을 선택하세요</h2>
        <p className="mt-2 text-gray-500">선택하지 않으면 기본값으로 생성됩니다</p>
      </div>

      {/* 빠른 선택 버튼 */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={selectRecommended}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          추천 항목만
        </button>
        <button
          onClick={selectAll}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          전체 선택
        </button>
        <button
          onClick={selectNone}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          선택 해제
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={clsx(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                {
                  "border-primary-500 bg-primary-50": isSelected,
                  "border-gray-200 hover:border-gray-300": !isSelected,
                }
              )}
            >
              {/* 선택 체크 */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}


              {/* 아이콘 */}
              <div className="mb-2 mt-2">
                <CategoryIcon
                  name={category.icon}
                  variant="gradient"
                  gradientClass={category.color}
                />
              </div>

              {/* 정보 */}
              <h3 className="font-medium text-gray-900">{category.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
            </button>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-xl text-center">
          <span className="text-primary-700 font-medium">
            {selectedCategories.length}개 항목 선택됨
          </span>
        </div>
      )}

      {selectedCategories.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
          <span className="text-gray-500">
            선택 안하고 바로 생성하기를 누르면 필수 항목만으로 생성됩니다
          </span>
        </div>
      )}
    </div>
  );
}
