import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/lib/axios";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface Props {
  onPromptSelect: (template: string) => void;
}

export function PromptSelect({ onPromptSelect }: Props) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) {
      return;
    }

    onPromptSelect(selectedPrompt.template);
  }

  useEffect(() => {
    api.get("/prompts").then((response) => {
      setPrompts(response.data);
    });
  }, []);

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map((prompt) => {
          return (
            <SelectItem
              key={prompt.id}
              value={prompt.id}
            >
              {prompt.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
