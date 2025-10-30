"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApi } from "@/lib/mockApi";

export default function JuradoPage() {
	const [profile, setProfile] = useState(null);
	const [ranking, setRanking] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const token = localStorage.getItem("token") || "mock_token";
				const [profileData, rankingData] = await Promise.all([
					mockApi.fetchJurorProfile(token),
					mockApi.fetchRanking(),
				]);
				setProfile(profileData);
				setRanking(rankingData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p>Carregando...</p>
			</div>
		);
	}

	return (
		<div
			className="relative min-h-screen bg-cover bg-center bg-no-repeat p-6"
			style={{ backgroundImage: "url('/background.png')" }}
		>
			<div className="container mx-auto max-w-2xl space-y-6">
				<div className="text-center">
					<h1 className="mb-2 text-4xl font-extrabold text-white">Painel do Jurado</h1>
					<p className="text-white/90">Dashboard simulado</p>
				</div>

				{profile && (
					<Card>
						<CardHeader>
							<CardTitle>Seu Perfil</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p>
									<strong>Nome:</strong> {profile.name}
								</p>
								<p>
									<strong>Total de votos:</strong> {profile.totalVotes}
								</p>
								<p>
									<strong>Posição no ranking:</strong> #{profile.rankingPosition}
								</p>
								{profile.badges && profile.badges.length > 0 && (
									<div className="mt-4">
										<p className="mb-2 font-bold">Badges:</p>
										<div className="flex flex-wrap gap-2">
											{profile.badges.map((badge) => (
												<span
													key={badge.code}
													className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
												>
													🏆 {badge.name}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{ranking && (
					<Card>
						<CardHeader>
							<CardTitle>Ranking - {ranking.category}</CardTitle>
							<CardDescription>Mínimo de {ranking.minVotes} votos</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{ranking.items.map((item, idx) => (
									<div key={idx} className="flex items-center justify-between rounded-lg border p-3">
										<div className="flex items-center gap-3">
											<span className="text-lg font-bold">#{idx + 1}</span>
											<div>
												<p className="font-bold">{item.user.name}</p>
											</div>
										</div>
										<span className="font-bold">{item.points} pts</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
