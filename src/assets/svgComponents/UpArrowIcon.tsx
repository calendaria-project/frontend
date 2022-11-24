const UpArrowIcon = ({ color, fontSize }: { color: string; fontSize?: string }) => {
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
                d="M34.8175 13.1872V3.74256C34.8175 2.37728 33.7107 1.27051 32.3454 1.27051H25.1553"
                strokeWidth="1.85404"
            />
            <path
                d="M0.999756 16.7304L8.76382 8.75629C9.73427 7.75958 11.3357 7.75958 12.3062 8.75629L18.2991 14.9113C19.2695 15.908 20.871 15.908 21.8414 14.9113L34.4953 1.91504"
                strokeWidth="1.85404"
                strokeLinecap="round"
            />
        </svg>
    );
};
export default UpArrowIcon;
