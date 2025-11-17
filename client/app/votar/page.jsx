"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft, Camera, CheckCircle2, Loader2, MapPin, Trophy, Award, ChevronRight, User, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { InputOTP } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { DevPanel } from "@/components/dev-panel";
import { cn } from "@/lib/utils";
import { maskCPF, maskPhone, formatPhoneForDisplay } from "@/lib/masks";
import { validateCPF, validatePhone, validateOTP } from "@/lib/validations";
import { mockApi } from "@/lib/mockApi";
import { useMobileGuard, useGPS, useCamera, useOTPTimer } from "@/lib/hooks";

const STEPS = {
	DESKTOP_GUARD: 0,
	WELCOME: 0.5,
	CPF: 1,
	PHONE: 2,
	OTP: 3,
	OTP_SUCCESS: 3.5,
	PLATE_CONFIRM: 4,
	PERMISSIONS: 5,
	ANALYZING: 5.5,
	CRITERIA_APRESENTACAO: 6,
	CRITERIA_SABOR: 7,
	CRITERIA_EXPERIENCIA: 8,
	COMMENT: 9,
	SUBMIT: 10,
	RANKING: 11,
	ALREADY_VOTED: 12,
};

function getLabelForScore(score) {
	if (score >= 4.5) return "Excelente";
	if (score >= 4.0) return "Acima da média";
	if (score >= 3.0) return "Adequado";
	if (score >= 2.0) return "Abaixo do padrão esperado";
	return "Muito abaixo do padrão";
}

function SharpStar({ filled = false, size = 20, className = "" }) {
	const sizeNum = typeof size === "string" ? parseInt(size) : size;
	// Estrela pontuda de 5 pontas usando coordenadas polares
	// Ponto superior, depois alternando entre pontos externos e internos
	const starPath = "M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z";
	return (
		<svg
			width={sizeNum}
			height={sizeNum}
			viewBox="0 0 24 24"
			className={className}
			fill={filled ? "currentColor" : "none"}
			stroke="currentColor"
			strokeWidth={filled ? "0" : "1.5"}
			strokeLinecap="butt"
			strokeLinejoin="miter"
		>
			<path d={starPath} />
		</svg>
	);
}

function StarRating({ rating, maxStars = 5, size = "5" }) {
	const fullStars = Math.floor(rating);
	const decimalPart = rating % 1;
	const hasHalfStar = decimalPart >= 0.5;
	const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
	
	const sizeClasses = {
		"4": 16,
		"5": 20,
		"6": 24,
		"7": 28,
	};
	const starSize = sizeClasses[size] || sizeClasses["5"];

	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: fullStars }).map((_, i) => (
				<SharpStar key={`full-${i}`} filled={true} size={starSize} className="text-yellow-400" />
			))}
			{hasHalfStar && (
				<div className="relative inline-block" style={{ width: starSize, height: starSize }}>
					<SharpStar filled={false} size={starSize} className="absolute inset-0 text-white/30" />
					<div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
						<SharpStar filled={true} size={starSize} className="text-yellow-400" />
					</div>
				</div>
			)}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<SharpStar key={`empty-${i}`} filled={false} size={starSize} className="text-white/30" />
			))}
		</div>
	);
}

function RankingView({ submitResult }) {
	const router = useRouter();
	const [ranking, setRanking] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showBadgeNotification, setShowBadgeNotification] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		async function loadData() {
			try {
				const token = localStorage.getItem("token") || "mock_token";
				const [rankingData, profileData] = await Promise.all([
					mockApi.fetchRanking(),
					mockApi.fetchJurorProfile(token),
				]);
				setRanking(rankingData);
				setProfile(profileData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	// Mostrar notificação de badge quando disponível
	useEffect(() => {
		if (submitResult?.badgeUnlocked) {
			setIsExiting(false);
			setShowBadgeNotification(true);
			const timer = setTimeout(() => {
				setIsExiting(true);
				setTimeout(() => {
					setShowBadgeNotification(false);
				}, 300); // Aguarda animação de saída
			}, 5000); // Some após 5 segundos
			return () => clearTimeout(timer);
		}
	}, [submitResult?.badgeUnlocked]);

	const handleCloseNotification = () => {
		setIsExiting(true);
		setTimeout(() => {
			setShowBadgeNotification(false);
		}, 300);
	};

	const getRankingColor = (position) => {
		if (position === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg";
		if (position === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg";
		if (position === 3) return "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg";
		return "bg-purple-100 text-purple-900";
	};

	const getUserLevel = (votes) => {
		if (votes >= 50) return { level: 5, label: "Mestre" };
		if (votes >= 30) return { level: 4, label: "Expert" };
		if (votes >= 15) return { level: 3, label: "Avançado" };
		if (votes >= 5) return { level: 2, label: "Intermediário" };
		return { level: 1, label: "Iniciante" };
	};

	const earnedBadgeCodes = new Set([
		...(profile?.badges?.map(b => b.code) || []),
		...(submitResult?.badgeUnlocked ? [submitResult.badgeUnlocked.code] : []),
	]);

	const allBadges = [
		{ code: "first_vote", name: "Primeira Avaliação", earned: true, emoji: "🎉" },
		{ code: "enthusiast", name: "Entusiasta", earned: earnedBadgeCodes.has("enthusiast"), emoji: "🍽️" },
		{ code: "sommelier", name: "Sommelier", earned: earnedBadgeCodes.has("sommelier"), emoji: "🍷" },
		{ code: "foodie", name: "Foodie", earned: earnedBadgeCodes.has("foodie"), emoji: "🍔" },
		{ code: "critic", name: "Crítico", earned: earnedBadgeCodes.has("critic"), emoji: "👀" },
	];

	if (loading) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
				<Loader2 className="h-12 w-12 animate-spin text-white" />
				<p className="text-white/80">Carregando...</p>
			</div>
		);
	}

	const totalVotes = profile?.totalVotes || (submitResult ? 1 : 0);
	const userLevel = getUserLevel(totalVotes);
	const userPosition = submitResult?.rankingPosition || profile?.rankingPosition || 0;

	return (
		<div className="space-y-5 pb-8 relative">
			{/* Notificação de Badge Desbloqueado */}
			{/* {showBadgeNotification && submitResult?.badgeUnlocked && (
				<div
					className={cn(
						"fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
						true
							? "opacity-0 translate-y-4 pointer-events-none"
							: "opacity-100 translate-y-0"
					)}
					style={{
						animation: isExiting ? "none" : "slideUpFadeIn 0.5s ease-out",
					}}
				>
					<Card className="overflow-hidden border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/30 to-yellow-600/50 backdrop-blur-md shadow-2xl min-w-[320px]">
						<CardContent className="p-5">
							<div className="flex items-center gap-4">
								<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-400/30 text-3xl shadow-lg animate-bounce">
									🏆
								</div>
								<div className="flex-1">
									<p className="w-fit px-3 py-1 border border-yellow-400/50 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-yellow-400/30">
										Badge Desbloqueado
									</p>
									<p className="mt-1 text-lg font-bold text-white">
										{submitResult.badgeUnlocked.name}
									</p>
								</div>
								<button
									onClick={handleCloseNotification}
									className="text-white/80 hover:text-white transition-colors"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</CardContent>
					</Card>
				</div>
			)} */}

			{/* Seção: Meu Perfil */}
			<div className="gap-2 flex flex-col">
				<h2 className="text-2xl font-extrabold text-white">Meu Perfil</h2>
				
				{/* Card Principal do Perfil */}
				<Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
					<CardContent className="p-5">
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<div className="relative">
								<div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-purple-200/50">
									{profile?.name?.charAt(0) || "J"}
								</div>
								<div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
									<CheckCircle2 className="h-3 w-3 text-white" />
								</div>
							</div>
							
							{/* Informações */}
							<div className="flex-1 min-w-0">
								<h3 className="text-xl font-extrabold text-purple-900 truncate">
									{profile?.name || "Jurado Impera"}
								</h3>
								<p className="text-sm font-semibold text-purple-600 mt-0.5">
									Jurado nível {userLevel.level} • {userLevel.label}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Cards de Estatísticas */}
				<div className="grid grid-cols-2 gap-2">
					<Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/30 shadow-xl">
						<CardContent className="p-4">
							<div className="text-center">
								<div className="text-3xl font-extrabold text-purple-900 mb-1">
									{totalVotes}
								</div>
								<p className="text-xs font-semibold text-purple-600">
									Pratos Avaliados
								</p>
							</div>
						</CardContent>
					</Card>
					
					<Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/30 shadow-xl">
						<CardContent className="p-4">
							<div className="text-center">
								<div className="text-3xl font-extrabold text-purple-900 mb-1">
									{userPosition > 0 ? `${userPosition}°` : "-"}
								</div>
								<p className="text-xs font-semibold text-purple-600">
									No ranking
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Seção: Meus Badges */}
			<div className="gap-2 flex flex-col">
				<h2 className="text-2xl font-extrabold text-white">Meus Badges</h2>
				
				<Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
					<CardContent className="p-4">
						<div className="flex gap-4 overflow-x-auto pb-0 scrollbar-hide -mx-1 px-1">
							{allBadges.map((badge, idx) => (
								<div
									key={badge.code}
									className={cn(
										"flex flex-col items-center gap-2 min-w-[90px] shrink-0 transition-all duration-300",
										badge.earned ? "opacity-100" : "opacity-40"
									)}
								>
									<div
										className={cn(
											"h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform duration-300",
											badge.earned
												? "bg-yellow-400/10 border-yellow-500 border scale-100 hover:scale-110"
												: "bg-gray-300 scale-100"
										)}
									>
										{badge.emoji || <Award className="h-8 w-8 text-gray-500" />}
									</div>
									<p className="text-xs font-bold text-center text-purple-900">{badge.name}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Seção: Ranking */}
			{ranking && (
				<div className="gap-2 flex flex-col">
					<h2 className="text-2xl font-extrabold text-white">Ranking</h2>
					
					<Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
						<CardContent className="p-0">
							<div className="divide-y divide-gray-200/50">
								{ranking.items.slice(0, 10).map((item, idx) => {
									const position = idx + 1;
									const isTop3 = position <= 3;
									const isCurrentUser = userPosition === position;
									const initials = item.user.name
										.split(" ")
										.map(n => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2);

									return (
										<div
											key={idx}
											className={cn(
												"flex items-center gap-4 p-4 transition-all duration-200",
												isCurrentUser && "bg-purple-100/50",
												!isCurrentUser && "hover:bg-gray-50/50"
											)}
										>
											{/* Posição */}
											<div
												className={cn(
													"flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-extrabold",
													getRankingColor(position)
												)}
											>
												{position}º
											</div>

											{/* Avatar */}
											<div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
												{initials}
											</div>

											{/* Nome */}
											<div className="flex-1 min-w-0">
												<p
													className={cn(
														"font-bold truncate",
														isCurrentUser ? "text-purple-900" : "text-gray-900"
													)}
												>
													{item.user.name}
												</p>
												{isCurrentUser && (
													<p className="text-xs text-purple-600 mt-0.5">Você</p>
												)}
											</div>

											{/* Pontuação */}
											<div className="text-right shrink-0">
												<div
													className={cn(
														"text-xl font-extrabold",
														isCurrentUser ? "text-purple-900" : "text-gray-900"
													)}
												>
													{item.points}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Botão para voltar */}
			<Button
				onClick={() => router.push("/")}
				className="bg-white text-purple-600 hover:bg-white/90 w-full shadow-xl font-bold"
				size="lg"
			>
				Voltar ao cardápio
			</Button>
		</div>
	);
}

function VotarContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { isMobile, isClient } = useMobileGuard();
	const { stream, error: cameraError, loading: cameraLoading, startCamera, stopCamera, switchCamera } = useCamera();
	const { data: gpsData, error: gpsError, loading: gpsLoading, getGPS } = useGPS();
	const { seconds: otpSeconds, start: startOTPTimer, reset: resetOTPTimer } = useOTPTimer(60);

	const [step, setStep] = useState(STEPS.WELCOME);
	const [loading, setLoading] = useState(false);
	const [otpValue, setOtpValue] = useState("");
	const [plateData, setPlateData] = useState(null);
	const [photoData, setPhotoData] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [analyzingProgress, setAnalyzingProgress] = useState(0);
	const [token, setToken] = useState(null);
	const [scores, setScores] = useState({
		apresentacao: 3.0,
		sabor: 3.0,
		experiencia: 3.0,
	});
	const [comment, setComment] = useState("");
	const [submitResult, setSubmitResult] = useState(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	const plateId = searchParams.get("plateId") || "plate_001";
	const editionId = searchParams.get("editionId") || "edition_2024";

	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const fabRef = useRef(null);

	useEffect(() => {
		if (!isClient) return;
		if (!isMobile) {
			setStep(STEPS.DESKTOP_GUARD);
		} else {
			setStep(STEPS.WELCOME);
		}
	}, [isClient, isMobile]);

	useEffect(() => {
		if (stream && videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	// Resetar OTP quando entrar na etapa OTP
	useEffect(() => {
		if (step === STEPS.OTP) {
			setOtpValue("");
		}
	}, [step]);

	// Detectar teclado virtual no mobile
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleVisualViewport = () => {
			if (window.visualViewport) {
				const viewportHeight = window.visualViewport.height;
				const windowHeight = window.innerHeight;
				const calculatedKeyboardHeight = windowHeight - viewportHeight;
				setKeyboardHeight(Math.max(0, calculatedKeyboardHeight));
			}
		};

		const handleResize = () => {
			// Fallback para navegadores sem Visual Viewport API
			const initialHeight = window.innerHeight;
			setTimeout(() => {
				const currentHeight = window.innerHeight;
				const heightDiff = initialHeight - currentHeight;
				if (heightDiff > 150) {
					// Teclado provavelmente aberto (diferença significativa)
					setKeyboardHeight(heightDiff);
				} else {
					setKeyboardHeight(0);
				}
			}, 100);
		};

		const handleFocus = () => {
			// Quando um input recebe foco, assume que o teclado vai aparecer
			setTimeout(() => {
				if (window.visualViewport) {
					handleVisualViewport();
				} else {
					handleResize();
				}
			}, 300);
		};

		const handleBlur = () => {
			// Quando o input perde foco, assume que o teclado vai desaparecer
			setTimeout(() => {
				setKeyboardHeight(0);
			}, 300);
		};

		// Usar Visual Viewport API quando disponível (melhor suporte iOS)
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", handleVisualViewport);
			window.visualViewport.addEventListener("scroll", handleVisualViewport);
		}

		// Fallbacks
		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);
		
		// Detectar quando inputs recebem/perdem foco
		const inputs = document.querySelectorAll("input, textarea");
		inputs.forEach((input) => {
			input.addEventListener("focus", handleFocus);
			input.addEventListener("blur", handleBlur);
		});

		return () => {
			if (window.visualViewport) {
				window.visualViewport.removeEventListener("resize", handleVisualViewport);
				window.visualViewport.removeEventListener("scroll", handleVisualViewport);
			}
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
			inputs.forEach((input) => {
				input.removeEventListener("focus", handleFocus);
				input.removeEventListener("blur", handleBlur);
			});
		};
	}, []);

	const loadPlate = async () => {
		try {
			const data = await mockApi.fetchPlate(plateId, editionId);
			setPlateData(data);

			if (token) {
				const checkVote = await mockApi.checkExistingVote(plateId, editionId, token);
				if (checkVote.hasVoted) {
					setStep(STEPS.ALREADY_VOTED);
					return;
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const {
		register: registerCPF,
		handleSubmit: handleSubmitCPF,
		watch: watchCPF,
		setValue: setCPFValue,
		formState: { errors: errorsCPF },
	} = useForm();

	const {
		register: registerPhone,
		handleSubmit: handleSubmitPhone,
		watch: watchPhone,
		setValue: setPhoneValue,
		formState: { errors: errorsPhone },
	} = useForm();

	const cpfValue = watchCPF("cpf") || "";
	const phoneValue = watchPhone("phone") || "";

	const handleCPFSubmit = async (data) => {
		const cleanCPF = data.cpf.replace(/\D/g, "");
		if (!validateCPF(cleanCPF)) {
			toast.error("CPF inválido");
			return;
		}
		setLoading(true);
		try {
			await mockApi.otpStart(cleanCPF, null);
			setStep(STEPS.PHONE);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePhoneSubmit = async (data) => {
		const cleanPhone = data.phone.replace(/\D/g, "");
		if (!validatePhone(cleanPhone)) {
			toast.error("Celular inválido");
			return;
		}
		const fullPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;
		setLoading(true);
		try {
			await mockApi.otpStart(null, fullPhone);
			toast.success(`Código enviado para ${formatPhoneForDisplay(fullPhone)}`);
			startOTPTimer();
			setOtpValue("");
			setStep(STEPS.OTP);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleOTPSubmit = async (otp) => {
		if (!validateOTP(otp)) {
			toast.error("Código inválido");
			return;
		}
		setLoading(true);
		try {
			const cleanPhone = phoneValue.replace(/\D/g, "");
			const fullPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;
			const result = await mockApi.otpVerify(fullPhone, otp);
			setToken(result.token);
			resetOTPTimer();
			setOtpValue("");
			setStep(STEPS.OTP_SUCCESS);
		} catch (error) {
			toast.error(error.message);
			setOtpValue("");
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		setLoading(true);
		try {
			const cleanPhone = phoneValue.replace(/\D/g, "");
			const fullPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;
			await mockApi.otpStart(null, fullPhone);
			toast.success("Código reenviado");
			setOtpValue("");
			startOTPTimer();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCapturePhoto = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		
		// Mantém proporção 3:4 para captura
		const width = 480;
		const height = 640; // 3:4 ratio
		
		canvas.width = width;
		canvas.height = height;
		
		const ctx = canvas.getContext("2d");
		
		// Calcula o crop para manter 3:4
		const videoAspect = video.videoWidth / video.videoHeight;
		const targetAspect = 3 / 4;
		
		let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
		
		if (videoAspect > targetAspect) {
			// Vídeo é mais largo, corta as laterais
			sw = video.videoHeight * targetAspect;
			sx = (video.videoWidth - sw) / 2;
		} else {
			// Vídeo é mais alto, corta o topo/fundo
			sh = video.videoWidth / targetAspect;
			sy = (video.videoHeight - sh) / 2;
		}
		
		ctx.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);

		canvas.toBlob(
			(blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					setPhotoPreview(url);
					setPhotoData(blob);
					stopCamera();
				}
			},
			"image/jpeg",
			0.9
		);
	};

	const handleConfirmPhoto = async () => {
		if (!photoData) return;

		setStep(STEPS.ANALYZING);
		setAnalyzingProgress(0);

		const progressInterval = setInterval(() => {
			setAnalyzingProgress((prev) => {
				if (prev >= 90) {
					clearInterval(progressInterval);
					return 90;
				}
				return prev + 10;
			});
		}, 500);

		try {
			const fileUrl = URL.createObjectURL(photoData);
			await mockApi.analyzeImage(fileUrl);
			setAnalyzingProgress(100);
			clearInterval(progressInterval);

			setTimeout(() => {
				setStep(STEPS.CRITERIA_APRESENTACAO);
			}, 500);
		} catch (error) {
			clearInterval(progressInterval);
			toast.error(error.message);
			setStep(STEPS.PERMISSIONS);
		}
	};

	const handleSubmitVote = async () => {
		setLoading(true);
		try {
			const result = await mockApi.submitVote({
				plateId,
				editionId,
				photo: photoData,
				...scores,
				comment: comment.trim() || null,
				token,
			});
			setSubmitResult(result);
			toast.success("Avaliação enviada com sucesso!");
			setStep(STEPS.RANKING);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};


	if (!isClient) {
		return (
			<div className="flex min-h-[100svh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-white" />
			</div>
		);
	}

	if (step === STEPS.DESKTOP_GUARD) {
		return (
			<div
				className="flex min-h-[100svh] flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: "url('/background.jpg')" }}
			>
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center">Votação disponível apenas no celular</CardTitle>
						<CardDescription className="text-center">
							Para garantir a integridade da votação, esta funcionalidade está disponível apenas em
							dispositivos móveis.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push("/")} className="w-full" variant="outline">
							Voltar ao início
						</Button>
						<Button
							onClick={() => window.open("/regulamento", "_blank")}
							className="mt-2 w-full"
							variant="ghost"
						>
							Ver regulamento
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isDev = searchParams.has("dev");

	return (
		<div
			className="relative min-h-[100svh] bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('/background-mobile.jpg')" }}
		>
			<div className="relative z-10 flex min-h-[100svh] h-[100svh] flex-col">
				<div className="flex-1 overflow-y-auto h-full">
					{step === STEPS.OTP_SUCCESS && (
						<img src="/jurado.jpg" alt="Jurado" className="w-full h-84 object-cover" />
					)}
					<div className="relative container mx-auto max-w-md px-8 py-12 pb-24 h-full">
						{step === STEPS.WELCOME && (
							<div className="flex flex-col items-center justify-center gap-8 h-full">
								<img
									src="/logo-impera-poster.png"
									alt="Logo Impera"
									className="h-auto w-full max-w-xs"
								/>
								<Button
									onClick={() => setStep(STEPS.CPF)}
									className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg uppercase"
									size="lg"
								>
									Começar
								</Button>
							</div>
						)}

						{step === STEPS.CPF && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">
										Bem-vindo ao Circuito Impera de Gastronomia
									</h1>
									<p className="text-white/90 text-left">Preencha seu CPF para iniciar a avaliação</p>
								</div>
								<form onSubmit={handleSubmitCPF(handleCPFSubmit)} className="space-y-4">
									<div>
										<label htmlFor="cpf" className="mb-2 block text-sm font-bold text-white">
											CPF
										</label>
										<Input
											variant="votar"
											id="cpf"
											type="tel"
											inputMode="numeric"
											{...registerCPF("cpf", {
												required: "CPF é obrigatório",
												validate: (value) => {
													const clean = value.replace(/\D/g, "");
													return validateCPF(clean) || "CPF inválido";
												},
											})}
											value={maskCPF(cpfValue)}
											onChange={(e) => {
												const masked = maskCPF(e.target.value);
												setCPFValue("cpf", masked);
											}}
											placeholder="000.000.000-00"
											className="h-12 text-lg"
											maxLength={14}
										/>
										{errorsCPF.cpf && (
											<p className="mt-1 text-sm text-red-300">{errorsCPF.cpf.message}</p>
										)}
									</div>
									<p className="text-xs text-white/80">
										Ao continuar, você concorda com nossa{" "}
										<a href="/lgpd" className="underline">
											política de privacidade
										</a>
										.
									</p>
								</form>
							</div>
						)}

						{step === STEPS.PHONE && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">
										Agora digite seu número de celular
									</h1>
									<p className="text-white/90 text-left">Vamos enviar um código para confirmar</p>
								</div>
								<form onSubmit={handleSubmitPhone(handlePhoneSubmit)} className="space-y-4">
									<div>
										<label htmlFor="phone" className="mb-2 block text-sm font-bold text-white">
											Celular
										</label>
										<Input
											variant="votar"
											id="phone"
											type="tel"
											inputMode="numeric"
											{...registerPhone("phone", {
												required: "Celular é obrigatório",
												validate: (value) => {
													const clean = value.replace(/\D/g, "");
													return validatePhone(clean) || "Celular inválido";
												},
											})}
											value={maskPhone(phoneValue)}
											onChange={(e) => {
												const masked = maskPhone(e.target.value);
												setPhoneValue("phone", masked);
											}}
											placeholder="(00) 00000-0000"
											className="h-12 text-lg"
											maxLength={15}
										/>
										{errorsPhone.phone && (
											<p className="mt-1 text-sm text-red-300">{errorsPhone.phone.message}</p>
										)}
									</div>
								</form>
							</div>
						)}

						{step === STEPS.OTP && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Insira o código recebido</h1>
									<p className="text-white/90 text-left">
										São 6 dígitos enviados para{" "}
										{formatPhoneForDisplay(
											phoneValue.replace(/\D/g, "").length === 11
												? `55${phoneValue.replace(/\D/g, "")}`
												: phoneValue.replace(/\D/g, "")
										)}
									</p>
								</div>
								<div className="space-y-6">
									<InputOTP
										value={otpValue}
										onChange={(value) => {
											setOtpValue(value);
											if (value.length === 6) {
												handleOTPSubmit(value);
											}
										}}
										loading={loading}
										disabled={loading}
										className="justify-center"
									/>
									{loading && otpValue.length === 6 && (
										<div className="flex items-center justify-center gap-2 text-white/80">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-sm">Validando código...</span>
										</div>
									)}
									<div className="text-center">
										{otpSeconds > 0 ? (
											<p className="text-sm text-white/80">Reenviar código em {otpSeconds}s</p>
										) : (
											<button
												onClick={handleResendOTP}
												disabled={loading}
												className="text-sm text-white underline transition-opacity hover:opacity-80 disabled:opacity-50"
											>
												Reenviar código
											</button>
										)}
									</div>
								</div>
							</div>
						)}

						{step === STEPS.OTP_SUCCESS && (
							<div className="flex flex-col items-center justify-center gap-8">
								<div className="text-center">
									<h1 className="mb-4 text-3xl font-extrabold text-white text-left">
										Agora você é um Jurado do Prêmio Impera!
									</h1>
									<p className="text-lg text-white/90 text-left leading-5">
										Se concentre e evite distrações para que você tenha o máximo de experiencia!
									</p>
									<p className="text-lg text-white/90 text-left mt-4 leading-5">
										Sua avaliação é muito importante para esse estabelecimento.
									</p>
								</div>
								<Button
									onClick={async () => {
										await loadPlate();
										setStep(STEPS.PLATE_CONFIRM);
									}}
									className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg uppercase"
									size="lg"
								>
									Começar
								</Button>
							</div>
						)}

						{step === STEPS.PLATE_CONFIRM && plateData && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Confirme o prato</h1>
									<p className="text-white/90 text-left">
										Antes de avaliar, confirme se esta é a receita que você pediu.
									</p>
								</div>
								<Card>
									<CardContent className="p-0">
										<img
											src={plateData.photo}
											alt={plateData.name}
											className="h-48 w-full rounded-t-lg object-cover"
										/>
										<div className="p-4">
											<h3 className="text-xl font-bold">{plateData.name}</h3>
											<p className="text-muted-foreground">{plateData.restaurant}</p>
											<p className="text-sm text-muted-foreground">{plateData.category}</p>
										</div>
									</CardContent>
								</Card>
								<Button
									onClick={() => {
										setStep(STEPS.PERMISSIONS);
										getGPS();
									}}
									className="bg-white text-purple-600 hover:bg-white/90 w-full"
									size="lg"
								>
									Confirmar e continuar
								</Button>
							</div>
						)}

						{step === STEPS.PERMISSIONS && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">
										Chegou a hora de registrar a receita!
									</h1>
									<p className="text-white/90 text-left">
										Precisamos de acesso à sua câmera e localização para continuar.
									</p>
								</div>
								<div className="space-y-4">
									{!stream && !photoPreview && (
										<div className="space-y-2">
											<Button
												onClick={() => startCamera('environment')}
												disabled={cameraLoading}
												className="bg-white text-purple-600 hover:bg-white/90 w-full"
												size="lg"
											>
												<Camera className="mr-2 h-5 w-5" />
												{cameraLoading ? "Abrindo câmera..." : "Permitir câmera"}
											</Button>
											{cameraError && (
												<div className="space-y-2">
													<p className="text-center text-sm text-red-300">{cameraError}</p>
													<Button
														onClick={() => startCamera('environment')}
														variant="outline"
														className="w-full text-white border-white/20 hover:bg-white/10"
														size="sm"
													>
														Tentar novamente
													</Button>
												</div>
											)}
										</div>
									)}
									{stream && !photoPreview && (
										<div className="space-y-4">
											<div className="relative w-full" style={{ aspectRatio: '3/4' }}>
												<video
													ref={videoRef}
													autoPlay
													playsInline
													muted
													className="w-full h-full rounded-lg object-cover"
													style={{ objectFit: 'cover' }}
													onLoadedMetadata={(e) => {
														// Garante que o video está pronto antes de tentar capturar
														if (videoRef.current && canvasRef.current) {
															const video = videoRef.current;
															const canvas = canvasRef.current;
															// Mantém proporção 3:4 para captura
															const width = 480;
															const height = 640; // 3:4 ratio
															
															video.setAttribute("width", width);
															video.setAttribute("height", height);
															canvas.setAttribute("width", width);
															canvas.setAttribute("height", height);
														}
													}}
												/>
											</div>
											<canvas ref={canvasRef} className="hidden" />
											<div className="flex gap-2">
												<Button
													onClick={stopCamera}
													variant="outline"
													className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex-1 backdrop-blur-sm"
												>
													Cancelar
												</Button>
												<Button
													onClick={switchCamera}
													variant="outline"
													className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
													title="Inverter câmera"
												>
													<Camera className="h-4 w-4 rotate-180" />
												</Button>
												<Button
													onClick={handleCapturePhoto}
													className="bg-white text-purple-600 hover:bg-white/90 flex-1"
												>
													Capturar
												</Button>
											</div>
										</div>
									)}
									{photoPreview && (
										<div className="space-y-4">
											<div className="w-full" style={{ aspectRatio: '3/4' }}>
												<img
													src={photoPreview}
													alt="Preview"
													className="w-full h-full rounded-lg object-cover"
												/>
											</div>
											<div className="flex gap-2">
												<Button
													onClick={() => {
														setPhotoPreview(null);
														setPhotoData(null);
														startCamera('environment'); // Reinicia com câmera traseira
													}}
													variant="outline"
													className="flex-1"
												>
													Refazer
												</Button>
												<Button onClick={handleConfirmPhoto} className="flex-1">
													Usar esta foto
												</Button>
											</div>
										</div>
									)}
									<div className="space-y-2">
										{gpsLoading && (
											<div className="flex items-center gap-2 text-white">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="text-sm">Obtendo localização...</span>
											</div>
										)}
										{gpsData && (
											<div className="flex items-center gap-2 text-white">
												{gpsData.inRadius ? (
													<>
														<CheckCircle2 className="h-4 w-4 text-green-400" />
														<span className="text-sm">
															GPS OK - Dentro do estabelecimento
														</span>
													</>
												) : (
													<>
														<MapPin className="h-4 w-4 text-red-400" />
														<span className="text-sm">
															Você precisa estar no estabelecimento para votar.
														</span>
													</>
												)}
											</div>
										)}
										{gpsError && (
											<div className="space-y-2">
												<div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
													<p className="text-sm text-red-300 font-medium mb-2">{gpsError}</p>
													{gpsError.toLowerCase().includes("negada") || gpsError.toLowerCase().includes("negado") ? (
														<div className="text-xs text-red-200/90 space-y-1">
															<p className="font-semibold">Como permitir a localização:</p>
															<ul className="list-disc list-inside space-y-1 ml-2">
																<li>No <strong>Chrome/Edge</strong>: Toque no ícone de cadeado na barra de endereço → Localização → Permitir</li>
																<li>No <strong>Safari</strong>: Configurações → Safari → Localização → Permitir</li>
																<li>No <strong>Firefox</strong>: Toque no ícone de cadeado → Configurações → Permitir localização</li>
															</ul>
														</div>
													) : null}
												</div>
												<Button
													onClick={getGPS}
													variant="outline"
													className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
													disabled={gpsLoading}
												>
													<MapPin className="mr-2 h-4 w-4" />
													{gpsLoading ? "Verificando..." : "Tentar novamente"}
												</Button>
											</div>
										)}
										{!gpsData && !gpsLoading && !gpsError && (
											<Button
												onClick={getGPS}
												variant="outline"
												className="w-full"
												disabled={gpsLoading}
											>
												<MapPin className="mr-2 h-4 w-4" />
												Verificar localização
											</Button>
										)}
									</div>
									{photoPreview && (
										<div className="space-y-2">
											{!gpsData && !gpsLoading && !gpsError && (
												<div className="space-y-2">
													<p className="text-center text-sm text-yellow-300 font-bold">
														⚠️ Você precisa verificar sua localização antes de continuar
													</p>
													<Button
														onClick={getGPS}
														variant="outline"
														className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
													>
														<MapPin className="mr-2 h-4 w-4" />
														Verificar localização
													</Button>
												</div>
											)}
											{gpsData && !gpsData.inRadius && (
												<div className="space-y-2">
													<p className="text-center text-sm text-red-300 font-bold">
														Você precisa estar dentro do estabelecimento para continuar.
													</p>
													<Button
														onClick={getGPS}
														variant="outline"
														className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
													>
														Tentar novamente
													</Button>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						)}

						{step === STEPS.ANALYZING && (
							<div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
								<Loader2 className="h-16 w-16 animate-spin text-white" />
								<h2 className="text-2xl font-extrabold text-white">Analisando imagem...</h2>
								<div className="w-full max-w-xs space-y-2">
									<Progress value={analyzingProgress} className="h-2 bg-white/20 backdrop-blur-sm" />
									<p className="text-center text-sm text-white/80">
										{analyzingProgress < 30 && "Checando integridade..."}
										{analyzingProgress >= 30 && analyzingProgress < 60 && "Comparando padrões..."}
										{analyzingProgress >= 60 &&
											analyzingProgress < 90 &&
											"Verificando originalidade..."}
										{analyzingProgress >= 90 && "Finalizando análise..."}
									</p>
								</div>
							</div>
						)}

						{step === STEPS.CRITERIA_APRESENTACAO && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Apresentação</h1>
									<p className="text-white/90 text-left">Avalie a apresentação visual do prato</p>
								</div>
								<div className="space-y-4">
									<ul className="space-y-2 text-sm text-white/90">
										<li>• Organização dos elementos no prato</li>
										<li>• Harmonia visual e cores</li>
										<li>• Cuidado na montagem</li>
									</ul>
									<div className="space-y-4">
										<div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
											<div className="text-center flex-1">
												<div className="text-4xl font-bold text-white mb-1">
													{scores.apresentacao.toFixed(1)}
												</div>
												<div className="text-sm text-white/90">
													{getLabelForScore(scores.apresentacao)}
												</div>
											</div>
										</div>
										<div className="px-2">
											<Slider
												value={scores.apresentacao}
												onChange={(value) => setScores({ ...scores, apresentacao: value })}
												min={1}
												max={5}
												step={0.1}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{step === STEPS.CRITERIA_SABOR && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Sabor</h1>
									<p className="text-white/90 text-left">Avalie o sabor e qualidade do prato</p>
								</div>
								<div className="space-y-4">
									<ul className="space-y-2 text-sm text-white/90">
										<li>• Combinação de sabores</li>
										<li>• Técnica e ponto de cocção</li>
										<li>• Retrogosto e persistência</li>
									</ul>
									<div className="space-y-4">
										<div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
											<div className="text-center flex-1">
												<div className="text-4xl font-bold text-white mb-1">
													{scores.sabor.toFixed(1)}
												</div>
												<div className="text-sm text-white/90">
													{getLabelForScore(scores.sabor)}
												</div>
											</div>
										</div>
										<div className="px-2">
											<Slider
												value={scores.sabor}
												onChange={(value) => setScores({ ...scores, sabor: value })}
												min={1}
												max={5}
												step={0.1}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{step === STEPS.CRITERIA_EXPERIENCIA && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Experiência Geral</h1>
									<p className="text-white/90 text-left">Avalie a experiência completa</p>
								</div>
								<div className="space-y-4">
									<ul className="space-y-2 text-sm text-white/90">
										<li>• Relação custo-benefício</li>
										<li>• Criatividade e originalidade</li>
										<li>• Atendimento e ambiente</li>
									</ul>
									<div className="space-y-4">
										<div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
											<div className="text-center flex-1">
												<div className="text-4xl font-bold text-white mb-1">
													{scores.experiencia.toFixed(1)}
												</div>
												<div className="text-sm text-white/90">
													{getLabelForScore(scores.experiencia)}
												</div>
											</div>
										</div>
										<div className="px-2">
											<Slider
												value={scores.experiencia}
												onChange={(value) => setScores({ ...scores, experiencia: value })}
												min={1}
												max={5}
												step={0.1}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{step === STEPS.COMMENT && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Comentário (opcional)</h1>
									<p className="text-white/90 text-left">
										Compartilhe sua opinião sobre a receita (máximo 280 caracteres)
									</p>
								</div>
								<div className="space-y-4">
									<div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
										<textarea
											value={comment}
											onChange={(e) => {
												if (e.target.value.length <= 280) {
													setComment(e.target.value);
												}
											}}
											placeholder="Escreva seu comentário aqui..."
											className="min-h-[180px] w-full rounded-md bg-white/5 border border-white/20 px-4 py-3 text-base text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white/40 resize-none transition-all cursor-text"
											maxLength={280}
										/>
										<div className="mt-3 flex items-center justify-between">
											<p className="text-xs text-white/60">
												Seu comentário será compartilhado publicamente
											</p>
											<p className={cn(
												"text-sm font-medium transition-colors",
												comment.length > 250 ? "text-red-300" : 
												comment.length > 200 ? "text-yellow-300" : 
												"text-white/80"
											)}>
												{comment.length}/280
											</p>
										</div>
									</div>
								</div>
								<div className="space-y-2 pt-4">
									<Button
										onClick={() => setStep(STEPS.SUBMIT)}
										className="bg-white text-purple-600 hover:bg-white/90 w-full"
										size="lg"
										disabled={loading}
									>
										Continuar
									</Button>
									<Button
										onClick={() => setStep(STEPS.SUBMIT)}
										variant="ghost"
										className="w-full text-white hover:bg-white/10"
									>
										Pular comentário
									</Button>
								</div>
							</div>
						)}

						{step === STEPS.SUBMIT && (() => {
							const averageScore = (scores.apresentacao + scores.sabor + scores.experiencia) / 3;
							return (
								<div className="space-y-6">
									<div className="text-center">
										<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Revisar avaliação</h1>
										<p className="text-white/90 text-left">Confira suas notas antes de enviar</p>
									</div>
									<Card className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20">
										<CardContent className="p-0">
											{photoPreview && (
												<div className="w-full" style={{ aspectRatio: '3/4' }}>
													<img
														src={photoPreview}
														alt="Foto do prato"
														className="w-full h-full object-cover"
													/>
												</div>
											)}
											<div className="p-4 space-y-4">
												<div className="space-y-3">
													<div className="flex items-center justify-between pb-3 border-b border-white/20">
														<div className="flex flex-col">
															<span className="text-sm font-medium text-white">Apresentação</span>
															<span className="text-xs text-white/70 mt-0.5">{getLabelForScore(scores.apresentacao)}</span>
														</div>
														<span className="text-lg font-bold text-white min-w-[3rem] text-right">
															{scores.apresentacao.toFixed(1)}
														</span>
													</div>
													<div className="flex items-center justify-between py-3 border-b border-white/20">
														<div className="flex flex-col">
															<span className="text-sm font-medium text-white">Sabor</span>
															<span className="text-xs text-white/70 mt-0.5">{getLabelForScore(scores.sabor)}</span>
														</div>
														<span className="text-lg font-bold text-white min-w-[3rem] text-right">
															{scores.sabor.toFixed(1)}
														</span>
													</div>
													<div className="flex items-center justify-between py-3 border-b border-white/20">
														<div className="flex flex-col">
															<span className="text-sm font-medium text-white">Experiência</span>
															<span className="text-xs text-white/70 mt-0.5">{getLabelForScore(scores.experiencia)}</span>
														</div>
														<span className="text-lg font-bold text-white min-w-[3rem] text-right">
															{scores.experiencia.toFixed(1)}
														</span>
													</div>
												</div>
												{comment && (
													<div className="pt-4 border-t border-white/20">
														<p className="text-xs font-medium text-white/90 mb-2">Comentário</p>
														<p className="text-sm text-white/90 leading-relaxed">{comment}</p>
													</div>
												)}
												<div className="mt-6">
													<div className="flex items-center justify-between">
														<div className="flex flex-col">
															<span className="text-base font-bold text-white">Avaliação Média</span>
															<span className="text-xs text-white/80 mt-1">{getLabelForScore(averageScore)}</span>
														</div>
														<div className="flex flex-col items-end justify-center gap-0">
															<span className="text-3xl font-extrabold text-white min-w-[4rem] text-right">
																{averageScore.toFixed(1)}
															</span>
															<StarRating rating={averageScore} size="6" />
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
									<Button
										onClick={handleSubmitVote}
										disabled={loading}
										className="bg-white text-purple-600 hover:bg-white/90 w-full mb-24"
										size="lg"
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												Enviando...
											</>
										) : (
											"Enviar avaliação"
										)}
									</Button>
								</div>
							);
						})()}

						{step === STEPS.RANKING && submitResult && (
							<RankingView submitResult={submitResult} />
						)}

						{step === STEPS.ALREADY_VOTED && (
							<div className="space-y-6">
								<div className="text-center">
									<h1 className="mb-2 text-3xl font-extrabold text-white text-left">Você já votou</h1>
									<p className="text-white/90 text-left">
										Jurado, você já votou nessa receita. Você pode votar somente uma vez para cada
										receita.
									</p>
								</div>
								<Button
									onClick={() => router.push("/")}
									className="bg-white text-purple-600 hover:bg-white/90 w-full"
									size="lg"
								>
									Voltar ao cardápio
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* FAB Botão Voltar */}
			{(step === STEPS.PHONE ||
				step === STEPS.CRITERIA_APRESENTACAO ||
				step === STEPS.CRITERIA_SABOR ||
				step === STEPS.CRITERIA_EXPERIENCIA) && (
				<button
					onClick={() => {
						if (step === STEPS.PHONE) {
							setStep(STEPS.CPF);
						} else if (step === STEPS.CRITERIA_APRESENTACAO) {
							setStep(STEPS.PERMISSIONS);
						} else if (step === STEPS.CRITERIA_SABOR) {
							setStep(STEPS.CRITERIA_APRESENTACAO);
						} else if (step === STEPS.CRITERIA_EXPERIENCIA) {
							setStep(STEPS.CRITERIA_SABOR);
						}
					}}
					disabled={loading}
					style={{
						bottom: keyboardHeight > 0 ? `${keyboardHeight + 24}px` : '24px',
						transition: 'bottom 0.3s ease-out',
					}}
					className={cn(
						"fixed left-6 z-30 flex h-16 w-16 items-center justify-center rounded-full transition-colors shadow-lg",
						"bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20",
						"disabled:opacity-50 disabled:cursor-not-allowed"
					)}
				>
					<ArrowLeft className="h-6 w-6" />
				</button>
			)}

			{/* FAB Botão Continuar */}
			{(step === STEPS.CPF ||
				step === STEPS.PHONE ||
				step === STEPS.CRITERIA_APRESENTACAO ||
				step === STEPS.CRITERIA_SABOR ||
				step === STEPS.CRITERIA_EXPERIENCIA) && (
				<button
					ref={fabRef}
					onClick={() => {
						if (step === STEPS.CPF) {
							const form = document.querySelector('form');
							if (form) form.requestSubmit();
						} else if (step === STEPS.PHONE) {
							const form = document.querySelector('form');
							if (form) form.requestSubmit();
						} else if (step === STEPS.CRITERIA_APRESENTACAO) {
							setStep(STEPS.CRITERIA_SABOR);
						} else if (step === STEPS.CRITERIA_SABOR) {
							setStep(STEPS.CRITERIA_EXPERIENCIA);
						} else if (step === STEPS.CRITERIA_EXPERIENCIA) {
							setStep(STEPS.COMMENT);
						}
					}}
					disabled={
						(step === STEPS.CPF && (!validateCPF(cpfValue.replace(/\D/g, "")) || loading)) ||
						(step === STEPS.PHONE && (!validatePhone(phoneValue.replace(/\D/g, "")) || loading)) ||
						loading
					}
					style={{
						bottom: keyboardHeight > 0 ? `${keyboardHeight + 24}px` : '24px',
						transition: 'bottom 0.3s ease-out',
					}}
					className={cn(
						"fixed right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full transition-colors shadow-lg",
						"disabled:bg-white disabled:text-purple-600",
						"bg-purple-600 text-white hover:bg-purple-700"
					)}
				>
					<ArrowRight className="h-6 w-6" />
				</button>
			)}

			{isDev && <DevPanel />}
		</div>
	);
}

export default function VotarPage() {
	return (
		<Suspense fallback={
			<div className="flex min-h-[100svh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-white" />
			</div>
		}>
			<VotarContent />
		</Suspense>
	);
}
