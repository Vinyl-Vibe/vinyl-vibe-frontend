import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "../../store/user";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoadingTime";

export function AccountDialog({ type = "profile", id }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const titles = {
        profile: {
            button: "Profile",
            title: "Profile",
            description: "Make changes to your profile here.",
        },
        address: {
            button: "Address",
            title: "Shipping address",
            description: "Update your shipping address.",
        },
    };

    const content = titles[type];

    const handleSuccess = () => {
        setOpen(false);
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button id={id} variant="outline" className="">
                        {content.button}
                    </Button>
                </DialogTrigger>
                <DialogContent className="space-y-4 px-0 sm:max-w-[425px]">
                    <DialogHeader className="items-top flex h-14 flex-row justify-between space-y-6 border-b border-border px-6">
                        <DialogTitle className="text-3xl font-medium tracking-[-0.12rem]">
                            {content.title}
                        </DialogTitle>
                        <DialogClose className="absolute -top-1 right-6">
                            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground transition-colors transition-opacity duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                <X className="h-4 w-4" />
                            </div>
                        </DialogClose>
                    </DialogHeader>
                    {type === "profile" ? (
                        <ProfileForm
                            className="px-6"
                            onSuccess={handleSuccess}
                        />
                    ) : (
                        <AddressForm
                            className="px-6"
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button id={id} variant="outline">
                    {content.button}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="px-0">
                <DialogHeader className="items-top flex h-14 flex-row justify-between space-y-6 border-b border-border px-6">
                    <DialogTitle className="text-3xl font-medium tracking-[-0.12rem]">
                        {content.title}
                    </DialogTitle>
                    <DialogClose className="absolute -top-1 right-6">
                        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground transition-colors transition-opacity duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                            <X className="h-4 w-4" />
                        </div>
                    </DialogClose>
                </DialogHeader>
                {type === "profile" ? (
                    <ProfileForm
                        className="px-6 pt-7"
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <AddressForm
                        className="px-6 pt-7"
                        onSuccess={handleSuccess}
                    />
                )}
                <DrawerFooter className="px-6 pb-6 pt-0">
                    <DrawerClose asChild>
                        <Button
                            variant=""
                            className="text-md mt-3 h-12 font-normal"
                        >
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function ProfileForm({ className, onSuccess }) {
    const { profile, updateProfile } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const showLoader = useMinimumLoadingTime(isSubmitting);

    const [formValues, setFormValues] = useState({
        firstName: profile?.profile?.firstName || "",
        lastName: profile?.profile?.lastName || "",
    });

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (!value.trim()) {
            const previousValue = profile?.profile?.[name] || "";
            setFormValues((prev) => ({
                ...prev,
                [name]: previousValue,
            }));
            e.target.value = previousValue;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
            };

            console.log("Submitting profile update:", data);
            await updateProfile(data);
            onSuccess?.();
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("grid items-start gap-6", className)}
        >
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    defaultValue={profile?.email}
                    placeholder="Your email"
                    disabled
                    className="h-12 rounded-xl bg-secondary disabled:hover:cursor-not-allowed disabled:hover:border-input disabled:hover:bg-secondary"
                />
            </div>
            <div className="flex gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="firstName"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your first name"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="lastName"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your last name"
                    />
                </div>
            </div>
            <Button
                className="text-md relative mt-2 h-12"
                variant="secondary"
                type="submit"
                disabled={showLoader}
            >
                {showLoader ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save changes"
                )}
            </Button>
        </form>
    );
}

function AddressForm({ className, onSuccess }) {
    const { profile, updateAddress } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const showLoader = useMinimumLoadingTime(isSubmitting);
    const address = profile?.profile?.address || {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target);
            const data = {
                street: formData.get("street") || address.street,
                city: formData.get("city") || address.city,
                state: formData.get("state") || address.state,
                postalCode: formData.get("postalCode") || address.postalCode,
                country: formData.get("country") || address.country,
            };

            await updateAddress(data);
            onSuccess?.(); // Close dialog on success
        } catch (error) {
            console.error("Failed to update address:", error);
            // Could add toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("grid items-start gap-6", className)}
        >
            <div className="grid gap-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                    id="street"
                    className="h-12 rounded-xl"
                    name="street"
                    defaultValue={address.street || ""}
                    placeholder="Street Address"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="city"
                        name="city"
                        defaultValue={address.city || ""}
                        placeholder="City"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="state"
                        name="state"
                        defaultValue={address.state || ""}
                        placeholder="State"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="postalCode">Post Code</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="postalCode"
                        name="postalCode"
                        defaultValue={address.postalCode || ""}
                        placeholder="Post Code"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                        className="h-12 rounded-xl"
                        id="country"
                        name="country"
                        defaultValue={address.country || ""}
                        placeholder="Country"
                        required
                    />
                </div>
            </div>
            <Button
                className="text-md relative mt-2 h-12"
                variant="secondary"
                type="submit"
                disabled={showLoader}
            >
                {showLoader ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save address"
                )}
            </Button>
        </form>
    );
}
