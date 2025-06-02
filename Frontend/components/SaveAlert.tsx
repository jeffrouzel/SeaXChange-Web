import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SaveAlertProps {
  onSave: () => void;
}

export default function SaveAlert({ onSave }: SaveAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className="bg-[#357C87] text-white hover:bg-white hover:text-[#429FAD] transition-colors duration-200"
        >
          Save
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Catch Details?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Pagkatapos mo pindot ang Save, indi mo na pwede maislan ang mga datos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
