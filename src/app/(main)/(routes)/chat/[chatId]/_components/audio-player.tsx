import { Button } from "@/components/ui/button";
import { StopCircle, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AudioPlayer = ({ text }: { text: string | undefined }) => {
  const [audioSrc, setAudioSrc] = useState("");
  const fetchAudio = async () => {
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        if (text === typeof undefined) {
          toast.error("Something went wrong");
        }
        const response = await fetch("/api/tts", {
          method: "POST",
          body: text,
          headers: { "Content-Type": "application/json" },
        });
        const audioUrl = URL.createObjectURL(await response.blob());
        setAudioSrc(audioUrl);
        resolve();
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
        reject();
      }
    });
    toast.promise(promise, {
      loading: "Generating",
      success:
        "The voice you are hearing is AI-generated and not a human voice.",
      error: "error",
    });
  };
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition"
      >
        {audioSrc ? (
          <StopCircle className="w-4 h-4 " onClick={() => setAudioSrc("")} />
        ) : (
          <Volume2 className="w-4 h-4" onClick={fetchAudio} />
        )}
      </Button>
      {audioSrc && (
        <audio src={audioSrc} autoPlay onEnded={() => setAudioSrc("")} />
      )}
    </>
  );
};

export default AudioPlayer;
