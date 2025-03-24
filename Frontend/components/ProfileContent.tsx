import { PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const ProfileContent = () => {
  return (
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Profile Information</h4>
          <p className="text-xs text-muted-foreground">
            contact administration for any changes.
          </p>
        </div>

        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name">Name:</Label>
            <p>John Fisher</p>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="role">Role:</Label>
            <p>Fisherman</p>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
};

export default ProfileContent;
