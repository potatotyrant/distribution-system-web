import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserStore } from "@/stores/use-user-store";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface FetchResponse<T> {
  error: boolean;
  data?: T;
  message: string;
}

export const apiFetch = async <T>(
  path: string,
  options: FetchOptions = {},
): Promise<FetchResponse<T>> => {
  const jwt = useAuthStore.getState().jsonWebToken;
  const url = `${API_URL}${path}`;
  // jwt가 있을 때만 포함할 헤더 설정
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (jwt) {
    headers.Authorization = `jwt ${jwt}`;
  }

  // 요청 내용 로깅
  console.log(`[FETCH REQUEST] ${options.method || "GET"} ${url}`, {
    headers,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `[FETCH RESPONSE error] ${options.method || "GET"} ${url}`,
        {
          status: response.status,
          data,
        },
      );
      // 에러 객체의 구조에 따라 적절한 메시지 추출
      const errorMessage =
        typeof data.error === "object" &&
        data.error !== null &&
        data.error.message
          ? data.error.message
          : typeof data.error === "string"
          ? data.error
          : "알 수 없는 오류가 발생했습니다";
      throw new Error(errorMessage);
    }

    console.log(`[FETCH RESPONSE] ${options.method || "GET"} ${url}`, {
      status: response.status,
      data,
    });

    return data as FetchResponse<T>;
  } catch (error) {
    console.error("[apiFetch] error", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다",
      data: undefined,
    };
  }
};
