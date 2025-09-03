'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Import certificate templates
import template1 from '@/cert_templates/Template1.png';
import template2 from '@/cert_templates/Template2.png';
import template3 from '@/cert_templates/Template3.png';
import template4 from '@/cert_templates/Template4.jpeg';
import template5 from '@/cert_templates/Template5.png';
import template6 from '@/cert_templates/Template6.png';
import template7 from '@/cert_templates/Template7.png';
import template8 from '@/cert_templates/Template8.png';
import template9 from '@/cert_templates/Template9.gif';
import template10 from '@/cert_templates/Template10.jpg';
import template11 from '@/cert_templates/Template11.png';

interface TemplatesSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  { id: 'template1', name: 'Classic Blue', image: template1 },
  { id: 'template2', name: 'Ocean Blue', image: template2 },
  { id: 'template3', name: 'Elegant Black', image: template3 },
  { id: 'template4', name: 'Simple White', image: template4 },
  { id: 'template5', name: 'Royal Red', image: template5 },
  { id: 'template6', name: 'Purple Galaxy', image: template6 },
  { id: 'template7', name: 'Sunset Orange', image: template7 },
  { id: 'template8', name: 'Purple Professional', image: template8 },
  { id: 'template9', name: 'Cyber Blue', image: template9 },
  { id: 'template10', name: 'Modern Gradient', image: template10 },
  { id: 'template11', name: 'Clean Minimal', image: template11 },
];

export default function TemplatesSelector({ selectedTemplate, onTemplateChange }: TemplatesSelectorProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Certificate Templates</h3>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                selectedTemplate === template.id
                  ? 'border-orange-500 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={template.image.src}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-end">
                  <div className="bg-black/70 text-white text-xs p-2 w-full">
                    {template.name}
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
