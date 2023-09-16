import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileVideo, Upload } from "lucide-react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

const statusMessages = {
  converting: "Convertendo...",
  uploading: "Carregando...",
  generating: "Transcrevendo",
  success: "Sucesso!",
};

interface Props {
  onVideoUploaded: (id: string) => void;
}

export function VideoInputForm({ onVideoUploaded }: Props) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  async function convertVideoToAudio(video: File) {
    console.log("Conversion started");

    const ffmpeg = await getFFmpeg();
    ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on("log", (log) => {
    //   console.log(log);
    // });

    ffmpeg.on("progress", (progress) => {
      console.log("Convert progress: " + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpegc",
    });

    console.log("Conversion finished!");
    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    setVideoFile(files.item(0));
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus("converting");
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("file", audioFile);

    setStatus("uploading");
    const response = await api.post("/videos", data);
    const videoId = response.data.video.id;

    setStatus("generating");

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setStatus("success");
    onVideoUploaded(videoId);
  }

  return (
    <form
      onSubmit={handleUploadVideo}
      className="space-y-6"
    >
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <Fragment>
            <FileVideo className="w-6 h-6" />
            Selecione um vídeo
          </Fragment>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          id="transcription_prompt"
          disabled={status !== "waiting"}
          ref={promptInputRef}
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button
        disabled={status !== "waiting"}
        type="submit"
        data-success={status === "success"}
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === "waiting" ? (
          <Fragment>
            Carregar vídeo
            <Upload className="w-4 h-4 ml-2" />
          </Fragment>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
