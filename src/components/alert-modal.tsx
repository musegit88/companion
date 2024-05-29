"use client";

import { useAlertModal } from "../../hooks/useAlertModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { deleteCharacter } from "@/actions/character-actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

type AlertModalProps = {
  characterId: string;
  characterName: string;
};

const AlertModal = ({ characterId, characterName }: AlertModalProps) => {
  const alertModal = useAlertModal();
  const { user } = useUser();
  const router = useRouter();
  const handleDelete = async () => {
    const response = await deleteCharacter({
      userId: user?.id,
      userName: user?.username,
      characterId,
      characterName,
    });

    if (response.status === "ok") {
      toast.success("Success");
      alertModal.onClose();
      router.refresh();
      router.push("/");
    } else {
      toast.error(`${response.message}`);
    }
  };
  return (
    <AlertDialog open={alertModal.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <b>{characterName}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => alertModal.onClose()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
