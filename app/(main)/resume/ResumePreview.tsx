"use client";

import React from "react";
import type { ResumeFormData, TemplateId } from "./types";
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from "./TemplateComponents";

interface Props {
  data: ResumeFormData;
  templateId: TemplateId;
}

export default function ResumePreview({ data, templateId }: Props) {
  if (templateId === "modern") return <ModernTemplate data={data} />;
  if (templateId === "minimal") return <MinimalTemplate data={data} />;
  return <ClassicTemplate data={data} />;
}
