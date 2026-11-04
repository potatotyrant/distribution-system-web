"use client";

import toast, { Toast, Toaster, resolveValue } from "react-hot-toast";
import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

/**
 * x 버튼이 있는 커스텀 Toaster 컴포넌트
 * 페이지 이동 시 모든 toast를 자동으로 닫습니다.
 */
export default function CustomToaster() {
  const pathname = usePathname();
  const processedToasts = useRef<Set<string>>(new Set());

  // 페이지 경로가 변경될 때마다 모든 toast 닫기
  useEffect(() => {
    toast.dismiss();
    processedToasts.current.clear();
  }, [pathname]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: Infinity, // 기본적으로 수동으로만 닫기
      }}
    >
      {(t) => {
        // 성공 메시지인 경우 3초 후 자동으로 닫기
        if (t.type === "success" && !processedToasts.current.has(t.id)) {
          processedToasts.current.add(t.id);
          setTimeout(() => {
            toast.dismiss(t.id);
          }, 3000);
        }

        return (
          <div
            style={{
              opacity: t.visible ? 1 : 0,
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "white",
              padding: "16px",
              borderRadius: "2px",
              boxShadow: "none",
              maxWidth: "500px",
              border:
                t.type === "success"
                  ? "1px solid #4fe699"
                  : t.type === "error"
                  ? "1px solid #e5484d"
                  : "1px solid #eaeaea",
            }}
          >
            {/* 아이콘 */}
            {t.type === "success" && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#0e9a56",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5L4.5 8.5L11 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {t.type === "error" && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#e5484d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L9 9M9 1L1 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {/* 메시지 */}
            <div
              style={{
                flex: 1,
                fontSize: "14px",
                color: "#1a1a1a",
                whiteSpace: "pre-line",
              }}
            >
              {resolveValue(t.message, t)}
            </div>

            {/* X 버튼 - 오류 메시지에서만 표시 */}
            {t.type === "error" && (
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: 0.5,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5";
                }}
                aria-label="닫기"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="#6a6a6a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      }}
    </Toaster>
  );
}
