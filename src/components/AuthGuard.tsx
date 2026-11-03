"use client";

import { AuthLevel, UserType } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect } from "react";
import { useUserStore } from "@/stores/use-user-store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const jsonWebToken = useAuthStore((state) => state.jsonWebToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    // 세션스토리지의 상태가 로드된 후에 체크
    if (!isHydrated) {
      return;
    }

    // 클라이언트 사이드 하이드레이션 후 추가 검증
    const validateAuth = async () => {
      try {
        if (!user || !jsonWebToken) {
          router.replace("/login");
          return;
        }

        // ADMIN이 아닌 사용자의 접근 제한
        if (user.authLevel !== AuthLevel.ADMIN) {
          const allowedPaths = [
            "/service/settlement-status/list",
            "/service/settlement-status/detail",
            "/community/announcement",
          ];

          // 현재 경로가 허용된 경로 목록에 없으면 메인 페이지로 리다이렉트
          if (!allowedPaths.some((path) => pathname.startsWith(path))) {
            router.replace("/community/announcement"); // 또는 다른 기본 페이지로 리다이렉트
            return;
          }
        }
        // 필요한 경우 토큰 유효성 검증 추가
      } catch (error) {
        console.error("Auth validation failed:", error);
        router.replace("/login");
      }
    };

    validateAuth();
  }, [user, jsonWebToken, router, isHydrated, pathname]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}
