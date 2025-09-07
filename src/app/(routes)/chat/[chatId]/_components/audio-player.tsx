import { Button } from "@/components/ui/button";
import { fetchAudio } from "@/lib/fetchAudio";
import { StopCircle, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AudioPlayer = ({ text }: { text: string | undefined }) => {
  const [audioSrc, setAudioSrc] = useState("");
  const apiUrl = "/api/tts";
  const playAudio = async () => {
    try {
      const audioBlob: String | Blob = await fetchAudio(text, apiUrl);
      if (audioBlob instanceof Blob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
        toast.success(
          "The voice you are hearing is AI-generated and not a human voice."
        );
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
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
          <Volume2 className="w-4 h-4" onClick={playAudio} />
        )}
      </Button>
      {audioSrc && (
        <audio src={audioSrc} autoPlay onEnded={() => setAudioSrc("")} />
      )}
    </>
  );
};

export default AudioPlayer;
