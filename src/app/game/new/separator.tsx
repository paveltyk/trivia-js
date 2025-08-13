export const Separator = ({ children }) => {
    return (
        <div className="relative border-t border-secondary">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary px-4">{children}</div>
        </div>
    );
};
