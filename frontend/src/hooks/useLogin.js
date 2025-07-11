import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api';
import { toast } from "react-hot-toast";

const useLogin = () => {
  //! query client instance
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data)
    }
  })
  return { loginMutation: mutate, isPending, error }
}

export default useLogin