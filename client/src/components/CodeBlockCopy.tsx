import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockCopyProps {
  code: string;
  language?: string;
}

export default function CodeBlockCopy({ code, language }: CodeBlockCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        {language && (
          <span className="text-xs font-semibold text-slate-400 uppercase">
            {language}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="ml-auto text-slate-400 hover:text-slate-200"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
