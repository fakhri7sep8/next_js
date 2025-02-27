import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useToast from "@/hook/useToast";
import { axiosClient } from "@/lib/axiosClient";
import { RegisterPayload, RegisterResponse, LoginPayload, LoginResponse } from "../interface";
import { signIn } from "next-auth/react";

const useAuthModule = () => {
  const { toastError, toastSuccess, toastWarning } = useToast();
  const router = useRouter();

  // Function untuk register
  const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axiosClient.post("/auth/register", payload);
    return response.data;
  };

  const useRegister = () => {
    return useMutation<RegisterResponse, Error, RegisterPayload>({
      mutationFn: register,
      onSuccess: (response) => {
        toastSuccess(response.message);
        router.push("/auth/login");
      },
      onError: () => {
        toastError();
      },
    });
  };

  // Function untuk login
  const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
  };

  const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginPayload>({
      mutationFn: login,
      onSuccess: async (response) => {
        toastSuccess(response.message);

        // Menyimpan token di NextAuth session
        await signIn("credentials", {
          id: response.data.id,
          name: response.data.nama,
          email: response.data.email,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          redirect: false,
          role:"admin",
          access : ["read"]
        });

        router.push("/admin");
      },
      onError: (error: any) => {
        if (error.response?.status === 422) {
          toastWarning(error.response.data.message);
        } else {
          toastError();
        }
      },
    });
  };

  return { useRegister, useLogin };
};

export default useAuthModule;
