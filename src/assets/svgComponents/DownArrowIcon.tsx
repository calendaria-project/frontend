const DownArrowIcon = ({ color, fontSize }: { color: string; fontSize?: string }) => {
    return (
        <svg
            width={fontSize || "36"}
            height="18"
            viewBox="0 0 36 18"
            fill="none"
            stroke={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.999676 4.81328L0.999676 14.2579C0.999676 15.6232 2.10645 16.73 3.47173 16.73L10.6619 16.73"
                strokeWidth="1.85404"
            />
            <path
                d="M34.8174 1.27058L27.0533 9.24469C26.0829 10.2414 24.4814 10.2414 23.511 9.24469L17.5181 3.08967C16.5476 2.09297 14.9462 2.09297 13.9757 3.08967L1.32179 16.0859"
                strokeWidth="1.85404"
                strokeLinecap="round"
            />
        </svg>
    );
};
export default DownArrowIcon;
