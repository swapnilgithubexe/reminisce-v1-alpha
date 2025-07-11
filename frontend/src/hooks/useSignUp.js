import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api';
import { toast } from "react-hot-toast";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("User logged in successfully!")
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: (error) => toast.error(error.response?.data?.message || error.response?.data || "Something went wrong")
  })

  return { signUpMutation: mutate, isPending, error };
}

export default useSignUp