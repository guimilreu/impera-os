import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bebasNeue = localFont({
	src: [
		{
			path: "./fonts/Bebas Neue Pro Expanded Thin.otf",
			weight: "100",
			style: "normal",
		},
		{
			path: "./fonts/Bebas Neue Pro Expanded Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/Bebas Neue Pro Expanded Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Bebas Neue Pro Expanded Middle.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Bebas Neue Pro Expanded Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/Bebas Neue Pro Expanded ExtraBold.otf",
			weight: "800",
			style: "normal",
		},
	],
	variable: "--font-bebas-neue",
	display: "swap",
});

export const metadata = {
	title: "Circuito Impera de Gastronomia",
	description: "Avaliação de pratos do Circuito Impera",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR" className={`${bebasNeue.className} antialiased`}>
			<body className="antialiased">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
