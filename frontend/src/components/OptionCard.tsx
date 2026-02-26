"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { OptionData, OptionField, OptionValue } from "@/types";

interface OptionCardProps {
  option?: OptionData;
  selections: Record<string, any>;
  onSelectionChange: (fieldId: string, value: any) => void;
}

export default function OptionCard({ option, selections, onSelectionChange }: OptionCardProps) {
  if (!option) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">옵션을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{option.title}</h2>
        <p className="mt-2 text-gray-500">{option.description}</p>
      </div>

      <div className="space-y-8">
        {option.options.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={selections[field.id]}
            onChange={(value) => onSelectionChange(field.id, value)}
            allSelections={selections}
          />
        ))}
      </div>
    </div>
  );
}

interface FieldRendererProps {
  field: OptionField;
  value: any;
  onChange: (value: any) => void;
  allSelections: Record<string, any>;
}

function FieldRenderer({ field, value, onChange, allSelections }: FieldRendererProps) {
  // dependsOn 체크
  if (field.dependsOn) {
    const dependentValue = allSelections[field.dependsOn.field];
    if (field.dependsOn.showWhen && !field.dependsOn.showWhen.includes(dependentValue)) {
      return null;
    }
    if (field.dependsOn.mapping && dependentValue) {
      const allowedValues = field.dependsOn.mapping[dependentValue];
      if (allowedValues) {
        field = {
          ...field,
          values: field.values?.filter((v) => allowedValues.includes(v.id)),
        };
      }
    }
  }

  switch (field.type) {
    case "select":
      return (
        <SelectField
          field={field}
          value={value}
          onChange={onChange}
        />
      );
    case "multiSelect":
      return (
        <MultiSelectField
          field={field}
          value={value || []}
          onChange={onChange}
        />
      );
    case "boolean":
      return (
        <BooleanField
          field={field}
          value={value}
          onChange={onChange}
        />
      );
    case "object":
      return (
        <ObjectField
          field={field}
          value={value || {}}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

function SelectField({ field, value, onChange }: { field: OptionField; value: string; onChange: (v: string) => void }) {
  return (
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.description && (
        <p className="text-sm text-gray-500 mb-3">{field.description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {field.values?.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={clsx(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
              {
                "border-primary-500 bg-primary-50": value === option.id,
                "border-gray-200 hover:border-gray-300": value !== option.id,
              }
            )}
          >
            {value === option.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="font-medium text-gray-900">{option.label}</span>
            {option.description && (
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            )}
            {option.example && (
              <p className="text-xs text-gray-400 mt-1 font-mono">{option.example}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelectField({ field, value, onChange }: { field: OptionField; value: string[]; onChange: (v: string[]) => void }) {
  const toggleValue = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.description && (
        <p className="text-sm text-gray-500 mb-3">{field.description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {field.values?.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleValue(option.id)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                {
                  "bg-primary-500 text-white": isSelected,
                  "bg-gray-100 text-gray-700 hover:bg-gray-200": !isSelected,
                }
              )}
            >
              {isSelected && <Check className="w-4 h-4 inline mr-1" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BooleanField({ field, value, onChange }: { field: OptionField; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="animate-slide-up flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <span className="font-medium text-gray-900">{field.label}</span>
        {field.description && (
          <p className="text-sm text-gray-500 mt-1">{field.description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={clsx(
          "relative w-14 h-8 rounded-full transition-colors duration-200",
          {
            "bg-primary-500": value,
            "bg-gray-300": !value,
          }
        )}
      >
        <div
          className={clsx(
            "absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200",
            {
              "translate-x-7": value,
              "translate-x-1": !value,
            }
          )}
        />
      </button>
    </div>
  );
}

function ObjectField({ field, value, onChange }: { field: OptionField; value: Record<string, any>; onChange: (v: Record<string, any>) => void }) {
  const properties = field.properties || {};

  const handlePropertyChange = (propId: string, propValue: any) => {
    onChange({
      ...value,
      [propId]: propValue,
    });
  };

  return (
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.description && (
        <p className="text-sm text-gray-500 mb-3">{field.description}</p>
      )}
      <div className="pl-4 border-l-2 border-primary-200 space-y-6">
        {Object.entries(properties).map(([propId, propDef]: [string, any]) => {
          if (propDef.type === "select") {
            return (
              <div key={propId}>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {propDef.label}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {propDef.values?.map((option: OptionValue) => (
                    <button
                      key={option.id}
                      onClick={() => handlePropertyChange(propId, option.id)}
                      className={clsx(
                        "relative p-3 rounded-lg border-2 text-left transition-all duration-200 text-sm",
                        {
                          "border-primary-500 bg-primary-50": value[propId] === option.id,
                          "border-gray-200 hover:border-gray-300": value[propId] !== option.id,
                        }
                      )}
                    >
                      {value[propId] === option.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{option.label}</span>
                      {option.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                      )}
                      {option.example && (
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{option.example}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (propDef.type === "multiSelect") {
            const selectedValues = value[propId] || [];
            const togglePropValue = (id: string) => {
              if (selectedValues.includes(id)) {
                handlePropertyChange(propId, selectedValues.filter((v: string) => v !== id));
              } else {
                handlePropertyChange(propId, [...selectedValues, id]);
              }
            };

            return (
              <div key={propId}>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {propDef.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {propDef.values?.map((option: OptionValue) => {
                    const isSelected = selectedValues.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => togglePropValue(option.id)}
                        className={clsx(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                          {
                            "bg-primary-500 text-white": isSelected,
                            "bg-gray-100 text-gray-700 hover:bg-gray-200": !isSelected,
                          }
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
