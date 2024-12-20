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
import { CheckCircle2, AlertCircle, X } from "lucide-react";
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
            trackList: [],
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
                    trackList: [],
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
                    trackList: currentProduct.albumInfo?.trackList || [],
                },
            };
            setFormData(initialFormData);

            // Debug log
            console.log("Initial form data:", initialFormData);
            console.log("Current product:", currentProduct);
        }
    }, [currentProduct, isCreating]);

    // Check for unsaved changes whenever formData changes
    useEffect(() => {
        if (isCreating) {
            // For new products, check if any field has been filled
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
                formData.albumInfo.trackList.length > 0;

            setHasUnsavedChanges(isChanged);
        } else if (currentProduct) {
            // Debug log
            console.log("Comparing form data:", formData);
            console.log("With current product:", currentProduct);

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

            // Debug log
            console.log("Is changed:", isChanged);

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
    const addTrack = () => {
        handleAlbumInfoChange("trackList", [
            ...formData.albumInfo.trackList,
            "",
        ]);
    };

    // Remove track
    const removeTrack = (index) => {
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
        if (!open && hasUnsavedChanges) {
            setShowUnsavedWarning(true);
            return;
        }
        if (!open) {
            setStatus(null);
            setMessage("");
            setHasUnsavedChanges(false);
            setCurrentProduct(null);
        }
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
            <SheetContent className="flex w-full flex-col sm:max-w-[540px]">
                {currentProduct || isCreating ? (
                    <>
                        <SheetHeader>
                            <SheetTitle>
                                {isCreating ? "Add Product" : "Edit Product"}
                            </SheetTitle>
                            <SheetDescription>
                                {isCreating
                                    ? "Add a new product to your store."
                                    : "Make changes to the product here."}{" "}
                                Click save when you're done.
                            </SheetDescription>
                            <SheetClose className="absolute right-6 top-6">
                                <div className="transition-colors-opacity flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                    <X className="h-4 w-4" />
                                </div>
                            </SheetClose>
                        </SheetHeader>
                        <ScrollArea className="">
                            <div className="grid gap-4 py-4">
                                {/* Basic Info */}
                                <div className="grid gap-2">
                                    <label htmlFor="name">Name</label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="price">Price</label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            handleChange(
                                                "price",
                                                parseFloat(e.target.value),
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="type">Type</label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) =>
                                            handleChange("type", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div className="grid gap-2">
                                    <label htmlFor="description">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleChange(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-0"
                                        style={{
                                            height: "auto",
                                            minHeight: "100px",
                                        }}
                                        onFocus={(e) => {
                                            // Adjust height on focus
                                            e.target.style.height = "auto";
                                            e.target.style.height =
                                                e.target.scrollHeight + "px";
                                        }}
                                        onInput={(e) => {
                                            // Adjust height as user types
                                            e.target.style.height = "auto";
                                            e.target.style.height =
                                                e.target.scrollHeight + "px";
                                        }}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="stock">Stock</label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            handleChange(
                                                "stock",
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </div>

                                {/* Brand field for non-vinyl products */}
                                {formData.type !== "vinyl" && (
                                    <div className="grid gap-2">
                                        <label htmlFor="brand">Brand</label>
                                        <Input
                                            id="brand"
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

                                {/* Album Info for vinyl products */}
                                {formData.type === "vinyl" && (
                                    <>
                                        <div className="grid gap-2">
                                            <label htmlFor="artist">
                                                Artist
                                            </label>
                                            <Input
                                                id="artist"
                                                value={
                                                    formData.albumInfo.artist
                                                }
                                                onChange={(e) =>
                                                    handleAlbumInfoChange(
                                                        "artist",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <label htmlFor="genre">Genre</label>
                                            <Input
                                                id="genre"
                                                value={formData.albumInfo.genre}
                                                onChange={(e) =>
                                                    handleAlbumInfoChange(
                                                        "genre",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <label htmlFor="releaseDate">
                                                Release Date
                                            </label>
                                            <Input
                                                id="releaseDate"
                                                type="date"
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

                                        <div className="grid gap-2">
                                            <label>Track List</label>
                                            {formData.albumInfo.trackList.map(
                                                (track, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2"
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
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeTrack(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                            <Button
                                                variant="outline"
                                                onClick={addTrack}
                                            >
                                                Add Track
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <SheetFooter>
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
                                <div className="flex w-full justify-end gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmit}>
                                        {isCreating
                                            ? "Create product"
                                            : "Save changes"}
                                    </Button>
                                </div>
                            </SheetFooter>
                        </ScrollArea>

                        {/* Unsaved Changes Warning */}
                        {showUnsavedWarning && (
                            <AlertDialog open={showUnsavedWarning}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Unsaved Changes
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You have unsaved changes. Are you
                                            sure you want to discard them?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            onClick={() =>
                                                setShowUnsavedWarning(false)
                                            }
                                        >
                                            Continue editing
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDiscardChanges}
                                        >
                                            Discard changes
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}
