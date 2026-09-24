"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { NavigationControls } from "./navigation-control";
import ProgressBar from "./progress-bar";

const parseSection = (section: string) => {
  const [title, ...content] = section.split("\n");
  const cleanTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();
  const points: String[] = [];
  let currentPoint = "";
  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("•")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      currentPoint = "";
    } else {
      currentPoint += " " + trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());
  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ),
  };
};

export default function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = summary
    .split("\n#")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const handleSectionSelect = (index: number) =>
    setCurrentSection(Math.min(Math.max(index, 0), sections.length - 1));
  return (
    <div className="w-full flex justify-center">
      <Card className="relative h-[400px] sm:h-[600px] lg:h-[600px] w-full max-w-2xl mx-auto bg-gradient-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-50">
        <CardHeader className="border-b border-rose-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {sections[currentSection].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-20 overflow-y-auto max-h-[calc(100%-8rem)]">
          <ProgressBar
            currentSection={currentSection}
            totalSections={sections.length}
          />
          <div className="prose max-w-none">
            {sections[currentSection].points.map((point, index) => (
              <div key={index} className="mb-3">
                <p className="text-base leading-relaxed text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <NavigationControls
          currentSection={currentSection}
          totalSections={sections.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSectionSelect={setCurrentSection}
        />
      </Card>
    </div>
  );
}