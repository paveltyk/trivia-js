import { cx } from "@/utils/cx";

// export const CardFooterExample = () => {
//     return (
//         <div className="flex flex-1 items-center justify-between gap-3">
//             <p className="text-sm text-tertiary">Feel free to start the game now. Teams can join later.</p>
//             <Button size="lg" color="secondary">
//                 Start game
//             </Button>
//         </div>
//     );
// };

export const Card = ({ children, footer, className }: { children: any; className?: any; footer?: any }) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="flex flex-col gap-6 px-4 py-5 lg:px-6 lg:py-6">{children}</div>
            {footer && <div className="flex items-center gap-4 border-t border-secondary px-4 py-3 md:py-4 lg:px-6">{footer}</div>}
        </div>
    );
};

export default Card;
