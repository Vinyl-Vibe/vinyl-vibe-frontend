import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useStoreManagement } from "@/store/store-management";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, X, Plus } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function AdminProductSheet({
    product,
    open,
    onOpenChange,
    isCreating,
}) {
    const { updateProduct, createProduct } = useStoreManagement();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [currentProduct, setCurrentProduct] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

    // Form state with defaults from product
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        type: "",
        description: "",
        stock: 0,
        brand: "",
        albumInfo: {
            artist: "",
            genre: "",
            releaseDate: "",
            trackList: [""],
        },
    });

    // Update currentProduct when product changes
    useEffect(() => {
        if (product) {
            setCurrentProduct(product);
        }
    }, [product]);

    // Update form data when product changes
    useEffect(() => {
        if (isCreating) {
            // Reset form data for new product
            setFormData({
                name: "",
                price: 0,
                type: "",
                description: "",
                stock: 0,
                brand: "",
                albumInfo: {
                    artist: "",
                    genre: "",
                    releaseDate: "",
                    trackList: [""],
                },
            });
        } else if (currentProduct) {
            // Ensure consistent data types and structure
            const initialFormData = {
                name: currentProduct.name || "",
                price: Number(currentProduct.price || 0),
                type: currentProduct.type || "",
                description: currentProduct.description || "",
                stock: Number(currentProduct.stock || 0),
                brand: currentProduct.brand || "",
                albumInfo: {
                    artist: currentProduct.albumInfo?.artist || "",
                    genre: currentProduct.albumInfo?.genre || "",
                    releaseDate: currentProduct.albumInfo?.releaseDate || "",
                    trackList: currentProduct.albumInfo?.trackList || [""],
                },
            };
            setFormData(initialFormData);
        }
    }, [currentProduct, isCreating]);

    // Check for unsaved changes whenever formData changes
    useEffect(() => {
        if (isCreating) {
            // For new products, check if any field has been meaningfully filled
            const isChanged =
                formData.name !== "" ||
                Number(formData.price) !== 0 ||
                formData.type !== "" ||
                formData.description !== "" ||
                Number(formData.stock) !== 0 ||
                formData.brand !== "" ||
                formData.albumInfo.artist !== "" ||
                formData.albumInfo.genre !== "" ||
                formData.albumInfo.releaseDate !== "" ||
                // Only consider track list if it has any non-empty tracks
                (formData.albumInfo.trackList.length > 0 &&
                    formData.albumInfo.trackList.some((track) => track !== ""));

            setHasUnsavedChanges(isChanged);
        } else if (currentProduct) {
            const isChanged =
                String(formData.name || "") !==
                String(currentProduct.name || "") ||
                Number(formData.price || 0) !==
                Number(currentProduct.price || 0) ||
                String(formData.type || "") !==
                String(currentProduct.type || "") ||
                String(formData.description || "") !==
                String(currentProduct.description || "") ||
                Number(formData.stock || 0) !==
                Number(currentProduct.stock || 0) ||
                String(formData.brand || "") !==
                String(currentProduct.brand || "") ||
                String(formData.albumInfo?.artist || "") !==
                String(currentProduct.albumInfo?.artist || "") ||
                String(formData.albumInfo?.genre || "") !==
                String(currentProduct.albumInfo?.genre || "") ||
                String(formData.albumInfo?.releaseDate || "") !==
                String(currentProduct.albumInfo?.releaseDate || "") ||
                JSON.stringify(formData.albumInfo?.trackList || []) !==
                JSON.stringify(currentProduct.albumInfo?.trackList || []);

            setHasUnsavedChanges(isChanged);
        }
    }, [formData, currentProduct, isCreating]);

    // Handle form changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle album info changes
    const handleAlbumInfoChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            albumInfo: {
                ...prev.albumInfo,
                [field]: value,
            },
        }));
    };

    // Handle track list changes
    const handleTrackListChange = (index, value) => {
        const newTrackList = [...formData.albumInfo.trackList];
        newTrackList[index] = value;
        handleAlbumInfoChange("trackList", newTrackList);
    };

    // Add new track
    const addTrack = (e) => {
        e?.preventDefault();
        handleAlbumInfoChange("trackList", [
            ...formData.albumInfo.trackList,
            "",
        ]);
    };

    // Remove track
    const removeTrack = (index, e) => {
        e?.preventDefault();
        const newTrackList = formData.albumInfo.trackList.filter(
            (_, i) => i !== index,
        );
        handleAlbumInfoChange("trackList", newTrackList);
    };

    const handleSubmit = async () => {
        try {
            const result = isCreating
                ? await createProduct(formData)
                : await updateProduct(product._id, formData);

            if (result.success) {
                setStatus("success");
                setMessage(
                    `Product ${isCreating ? "created" : "updated"} successfully`,
                );
            } else {
                console.error("Failed to update product:", result.error);
                setStatus("error");
                setMessage(
                    result.error ||
                    `Failed to ${isCreating ? "create" : "update"} product`,
                );
            }
        } catch (error) {
            console.error("Error updating product:", error);
            setStatus("error");
            setMessage(error.message || "An unexpected error occurred");
        }
    };

    // Handle sheet closing
    const handleSheetClose = (open) => {
        // If we're trying to close the sheet
        if (!open) {
            // If there are unsaved changes, show warning
            if (hasUnsavedChanges) {
                setShowUnsavedWarning(true);
                return;
            }
        }

        // Otherwise, proceed with closing
        if (!open) {
            setStatus(null);
            setMessage("");
            setHasUnsavedChanges(false);
            setCurrentProduct(null);
        }

        // Always update the sheet state
        onOpenChange(open);
    };

    // Handle cancel
    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowUnsavedWarning(true);
        } else {
            onOpenChange(false);
        }
    };

    // Handle discard changes
    const handleDiscardChanges = () => {
        setShowUnsavedWarning(false);
        setHasUnsavedChanges(false);
        setCurrentProduct(null);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleSheetClose}>
            <SheetContent className="flex w-full flex-col gap-0 space-y-0 p-0 sm:max-w-[540px]">
                {currentProduct || isCreating ? (
                    <>
                        {/* Fixed Header */}
                        <SheetHeader className="flex h-20 shrink-0 flex-row items-center justify-between border-b px-6">
                            <SheetTitle className="text-3xl font-medium tracking-[-0.1rem]">
                                {isCreating ? "Add product" : "View product"}
                            </SheetTitle>
                            <SheetDescription className="hidden">
                                {isCreating
                                    ? "Add a new product"
                                    : "View product details"}
                            </SheetDescription>
                            <SheetClose>
                                <div className="transition-colors-opacity flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                    <X className="h-4 w-4" />
                                </div>
                            </SheetClose>
                        </SheetHeader>

                        {/* Main Content Area */}
                        <div className="flex min-h-0 flex-1 flex-col">
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col">
                                    {/* Basic Info Section */}
                                    <div className="grid grid-cols-1 gap-6 p-6 py-4 md:grid-cols-2">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Name
                                                    </h5>
                                                    <Input
                                                        value={formData.name}
                                                        className="rounded-xl"
                                                        placeholder="Product name"
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Price
                                                    </h5>
                                                    <Input
                                                        type="number"
                                                        className="rounded-xl"
                                                        step="0.01"
                                                        value={formData.price}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "price",
                                                                parseFloat(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Type
                                                    </h5>
                                                    <Select
                                                        value={formData.type}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            handleChange(
                                                                "type",
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl p-[3px] px-0.5">
                                                            <SelectItem value="vinyl">
                                                                Vinyl
                                                            </SelectItem>
                                                            <SelectItem value="turntable">
                                                                Turntable
                                                            </SelectItem>
                                                            <SelectItem value="accessory">
                                                                Accessory
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Stock
                                                    </h5>
                                                    <Input
                                                        type="number"
                                                        value={formData.stock}
                                                        className="rounded-xl"
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "stock",
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brand field spans both columns */}
                                        {formData.type &&
                                            formData.type !== "vinyl" && (
                                                <div className="md:col-span-2">
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Brand
                                                    </h5>
                                                    <Input
                                                        value={formData.brand}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "brand",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>

                                    {/* Description Section */}
                                    <div className="border-t px-6 py-4">
                                        <h4 className="mb-3 text-sm font-medium">
                                            Description
                                        </h4>
                                        <Textarea
                                            value={formData.description}
                                            className="bg-white min-h-[100px] resize-none"
                                            placeholder="Product description"
                                            onChange={(e) =>
                                                handleChange(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Album Info Section (for vinyl only) */}
                                    {formData.type === "vinyl" && (
                                        <div className="border-t px-6 py-4">
                                            <h4 className="mb-4 text-sm font-medium">
                                                Album Details
                                            </h4>
                                            <div className="rounded-2xl border py-4">
                                                <div className="grid gap-4 px-4 text-sm md:grid-cols-2">
                                                    <div>
                                                        <h5 className="mb-2 text-sm font-medium text-foreground">
                                                            Artist
                                                        </h5>
                                                        <Input
                                                            value={
                                                                formData
                                                                    .albumInfo
                                                                    .artist
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="Artist name"
                                                            onChange={(e) =>
                                                                handleAlbumInfoChange(
                                                                    "artist",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-2 text-sm font-medium text-foreground">
                                                            Genre
                                                        </h5>
                                                        <Input
                                                            value={
                                                                formData
                                                                    .albumInfo
                                                                    .genre
                                                            }
                                                            className="rounded-xl"
                                                            placeholder="Genre"
                                                            onChange={(e) =>
                                                                handleAlbumInfoChange(
                                                                    "genre",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 px-4">
                                                    <h5 className="mb-2 text-sm font-medium text-foreground">
                                                        Release Date
                                                    </h5>
                                                    <Input
                                                        type="date"
                                                        className="rounded-xl"
                                                        value={
                                                            formData.albumInfo
                                                                .releaseDate
                                                                ? format(
                                                                    new Date(
                                                                        formData.albumInfo.releaseDate,
                                                                    ),
                                                                    "yyyy-MM-dd",
                                                                )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleAlbumInfoChange(
                                                                "releaseDate",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Track List Section (for vinyl only) */}
                                    {formData.type === "vinyl" && (
                                        <div className="border-t px-6 py-4">
                                            <h4 className="mb-4 text-sm font-medium">
                                                Track List
                                            </h4>
                                            <div className="space-y-4">
                                                {formData.albumInfo.trackList.map(
                                                    (track, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Input
                                                                value={track}
                                                                onChange={(e) =>
                                                                    handleTrackListChange(
                                                                        index,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder={`Track ${index + 1}`}
                                                                className="flex-1 rounded-xl"
                                                            />
                                                            {index ===
                                                                formData
                                                                    .albumInfo
                                                                    .trackList
                                                                    .length -
                                                                1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="confirm"
                                                                        className="h-10 w-10 rounded-full"
                                                                        onClick={
                                                                            addTrack
                                                                        }
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            {formData.albumInfo
                                                                .trackList
                                                                .length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        className="h-10 w-10 rounded-full"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            removeTrack(
                                                                                index,
                                                                                e,
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Fixed Footer */}
                            <div className="shrink-0 border-t bg-secondary/50">
                                <div className="space-y-4 p-6">
                                    {status && (
                                        <Alert
                                            variant={
                                                status === "success"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className="mb-4"
                                        >
                                            {status === "success" ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4" />
                                            )}
                                            <AlertDescription>
                                                {message}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <div className="flex justify-end gap-4">
                                        <Button
                                            variant=""
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={handleSubmit}
                                        >
                                            {isCreating
                                                ? "Create product"
                                                : "Save changes"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}

                {/* Unsaved Changes Warning Dialog */}
                {showUnsavedWarning && (
                    <AlertDialog open={showUnsavedWarning}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Unsaved Changes
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    You have unsaved changes. Are you sure you
                                    want to discard them?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={handleDiscardChanges}
                                >
                                    Discard changes
                                </AlertDialogAction>
                                <AlertDialogCancel
                                    onClick={() => setShowUnsavedWarning(false)}
                                >
                                    Continue editing
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                <SheetDescription className="hidden">
                    Product details
                </SheetDescription>
                <SheetTitle className="hidden">Product details </SheetTitle>
            </SheetContent>
        </Sheet>
    );
}
