import { useRouter } from "expo-router";

export function useNavigate() {
  const router = useRouter();
  return router.navigate;
}
