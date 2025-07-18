import { getAuthUser } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

const useAuthUser = () => {
  const isTokenPresent = localStorage.getItem("token")
  //! react query setup
  //! custom hook is created and the code from app.js is transferred here to make it look cleaner and make it readable
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,    //! auth check only once
    enabled: !!isTokenPresent, //! only fetch when token is there
    staleTime: 1000 * 60 * 5 //! refetch time
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user, refetch: authUser.refetch }
}


export default useAuthUser