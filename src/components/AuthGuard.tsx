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

        // Client-side only: every signed-in user can open every sidebar section.
        if (user.authLevel !== AuthLevel.ADMIN) {
          useAuthStore.setState({
            user: { ...user, authLevel: AuthLevel.ADMIN },
            isAdmin: true,
          });
        }
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
