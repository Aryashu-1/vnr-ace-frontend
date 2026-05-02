"use client"

import { ChevronRight, User, Terminal, Tag, FileText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Question {
  question: string;
  tags?: string[];
}

interface Round {
  round: string;
  questions: Question[];
}

interface StructuredExperience {
  candidate: string;
  rounds: Round[];
}

export function InterviewExperienceCard({ exp, index }: { exp: any, index: number }) {
  // Try to parse if it's a string that looks like JSON
  let data = exp;
  if (typeof exp === 'string') {
    try {
      // Basic check to see if it starts with { or [
      if (exp.trim().startsWith('{') || exp.trim().startsWith('[')) {
        data = JSON.parse(exp);
      }
    } catch (e) {
      // Not JSON, keep as string
    }
  }

  const isStructured = data && typeof data === 'object' && (data.rounds || data.candidate);

  if (!isStructured) {
    const content = typeof data === 'object' ? (data.content || data.experience || JSON.stringify(data)) : data;
    return (
      <div className="flex gap-3 text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-purple-500" />
        </div>
        <div className="flex-1">
            <span className="leading-relaxed whitespace-pre-wrap">{content}</span>
        </div>
      </div>
    );
  }

  const experience = data as StructuredExperience;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 hover:shadow-md transition-all">
      <div className="bg-gray-50/80 p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          {experience.candidate || `Experience ${index + 1}`}
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold px-2 py-0.5 rounded-md">
          {experience.rounds?.length || 0} Rounds
        </Badge>
      </div>
      
      <div className="p-2">
        <Accordion type="single" collapsible className="w-full">
          {experience.rounds?.map((round, rIdx) => (
            <AccordionItem key={rIdx} value={`round-${index}-${rIdx}`} className="border-none mb-1">
              <AccordionTrigger className="hover:no-underline px-4 py-3 rounded-lg hover:bg-purple-50/50 transition-all text-sm font-bold text-gray-800 data-[state=open]:bg-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded bg-white shadow-sm border border-gray-100">
                    <Terminal className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  {round.round}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4 ml-8 border-l-2 border-purple-100/50 pl-6 py-1">
                  {round.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="group relative">
                      {/* Bullet point accent */}
                      <div className="absolute -left-[1.65rem] top-2 w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-400 transition-colors shadow-sm" />
                      
                      <p className="text-sm text-gray-800 font-medium leading-relaxed group-hover:text-purple-700 transition-colors">
                        {q.question}
                      </p>
                      {q.tags && q.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {q.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-100 group-hover:border-purple-100 group-hover:text-purple-400 transition-all">
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
