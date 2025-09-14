import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"
import { CircleCheckIcon } from "lucide-react";

const pricingCardVariant = cva(
    "rounded-lg p-4 py-6 w-full",
    {
        variants: {
            variant: {
                default: "bg-white text-black",
                highlighted: "bg-linear-to-br from-[#093C23] to-[#051B16] text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const pricingCardIconVariant = cva(
    "size-5",
    {
        variants: {
            variant: {
                default: "fill-primary text-white",
                highlighted: "fill-white text-black",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const pricingCardSecondaryTextVariant = cva(
    "text-neutral-700",
    {
        variants: {
            variant: {
                default: "text-neutral-700",
                highlighted: "text-neutral-300",
            },
        },
    }
);

const pricingCardBadgeVariant = cva(
    "text-black text-xs font-normal p-1",
    {
        variants: {
            variant: {
                default: "bg-primary/20",
                highlighted: "bg-[#F5B797]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface Props extends VariantProps<typeof pricingCardVariant> {
    badge?: string | null;
    price: number;
    features: string[];
    title: string;
    description: string;
    priceSuffix?: string;
    className?: string;
    buttonText: string;
    onClick?: () => void;
    isPopular?: boolean;
};

export const PricingCard = ({
    badge,
    price,
    features,
    title,
    description,
    priceSuffix,
    className,
    buttonText,
    onClick,
    isPopular,
    variant,
}: Props) => {
    return (
        <div className={cn(pricingCardVariant({ variant }), className, "border")}>
           <div className="flex items-end gap-y-4 justify-between">
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2">
                        <h6 className="font-medium text-xl">{title}</h6>
                            {badge ? (
                                <Badge className={cn(pricingCardBadgeVariant({ variant }))}>{badge}</Badge>
                            ) : null }
                    </div>
                    <p className={cn("text-xs",
                        pricingCardSecondaryTextVariant({ variant }),
                    )}>
                        {description}
                    </p>
                </div>
                <div className="flex items-center shrink-0 gap-x-0.5">
                    <h4 className="font-medium text-3xl">
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                        }).format(price)}
                    </h4>
                    <span className={cn("text-xs",
                        pricingCardSecondaryTextVariant({ variant }),
                    )}>
                        {priceSuffix}
                    </span>
                </div>
           </div>
           <div className="py-6">
            <Separator className="opacity-10 text-[#5d6b68]" />
           </div>
           <Button
                className="w-full"
                size="lg"
                variant={variant === "highlighted" ? "default" : "outline"}
                onClick={onClick}
            >
                {buttonText}
            </Button>
            <div>
                <p className="font-medium uppercase">Features</p>
                <ul className={cn("flex flex-col gap-y-2.5",
                    pricingCardSecondaryTextVariant({ variant }),
                )}>
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-x-2.5">
                            <CircleCheckIcon className={cn(pricingCardIconVariant({ variant }))} />
                            <p>{feature}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
