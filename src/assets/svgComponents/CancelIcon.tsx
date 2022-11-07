const CancelIcon = ({ color, fontSize }: { color: string; fontSize?: string }) => {
    return (
        <svg
            width={fontSize || "24"}
            height={fontSize || "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
export default CancelIcon;
