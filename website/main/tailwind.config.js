/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ejs,ts,js}", "./src/ui/**/*.ejs"],
    theme: {
        extend: {
            colors: {
                text: {
                    50: "#f2f2f2",
                    100: "#e6e6e6",
                    200: "#cccccc",
                    300: "#b3b3b3",
                    400: "#999999",
                    500: "#808080",
                    600: "#666666",
                    700: "#4d4d4d",
                    800: "#333333",
                    900: "#1a1a1a",
                    950: "#0d0d0d",
                },
                background: {
                    50: "#f2f2f2",
                    100: "#e6e6e6",
                    200: "#cccccc",
                    300: "#b3b3b3",
                    400: "#999999",
                    500: "#808080",
                    600: "#666666",
                    700: "#4d4d4d",
                    800: "#333333",
                    900: "#1a1a1a",
                    950: "#0d0d0d",
                },
                primary: {
                    50: "#fde8e7",
                    100: "#fbd2d0",
                    200: "#f7a5a1",
                    300: "#f47871",
                    400: "#f04b42",
                    500: "#ec1e13",
                    600: "#bd180f",
                    700: "#8e120b",
                    800: "#5e0c08",
                    900: "#2f0604",
                    950: "#180302",
                },
                secondary: {
                    50: "#fbe9e9",
                    100: "#f7d4d4",
                    200: "#f0a8a8",
                    300: "#e87d7d",
                    400: "#e05252",
                    500: "#d92626",
                    600: "#ad1f1f",
                    700: "#821717",
                    800: "#570f0f",
                    900: "#2b0808",
                    950: "#160404",
                },
                accent: {
                    50: "#edf8ed",
                    100: "#dbf1da",
                    200: "#b6e2b6",
                    300: "#92d491",
                    400: "#6ec66c",
                    500: "#49b847",
                    600: "#3b9339",
                    700: "#2c6e2b",
                    800: "#1d491d",
                    900: "#0f250e",
                    950: "#071207",
                },
                "bright-red": "#FF0000",
            },
            fontSize: {
                sm: "0.750rem",
                base: "1rem",
                xl: "1.333rem",
                "2xl": "1.777rem",
                "3xl": "2.369rem",
                "4xl": "3.158rem",
                "5xl": "4.210rem",
            },
            fontFamily: {
                heading: "Poppins",
                body: "Poppins",
                code: '"Fira Code"',
            },
            fontWeight: {
                normal: "400",
                bold: "700",
            },
        },
    },
    plugins: [],
};

