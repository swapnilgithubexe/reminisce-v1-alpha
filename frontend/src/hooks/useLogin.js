import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router';

const useLogin = () => {
  //! query client instance
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Log in successful!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data)
    }
  })
  return { loginMutation: mutate, isPending, error }
}

export default useLogin